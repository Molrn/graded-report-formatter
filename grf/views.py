import json
from django.views import generic
import jsonschema
from jsonschema.exceptions import ValidationError
from .models import Report, ReportPart, ReportSubPart
from django.http import HttpRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.contrib.staticfiles.finders import find

class IndexView(generic.TemplateView):
    template_name = 'index.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['all_reports'] = Report.objects.all()
        return context

class ReportView(generic.DetailView):
    model = Report
    template_name = 'report/edit.html'
    
    def get_object(self, queryset=None):
        id = self.kwargs.get("id")
        return Report.objects.get(pk=id)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['template_part'] = ReportPart(pk=None)
        context['template_subpart'] = ReportSubPart(pk=None)
        return context

class ReportDisplayView(generic.DetailView):
    model = Report
    template_name = 'report/display.html'
    
    def get_object(self, queryset=None):
        id = self.kwargs.get("id")
        return Report.objects.get(pk=id)

@csrf_exempt
def save_report(request:HttpRequest):
    if request.method == 'POST':
        request_body = json.loads(request.body.decode('utf-8'))
        dict_report = request_body.get('report', {})
        is_valide, validation_message = validate_json_report(dict_report)
        if not is_valide:
            return JsonResponse({'message': validation_message}, status=400)      
        
        if 'parts_to_remove' in dict_report:
            for id in dict_report['parts_to_remove']:
                ReportPart.objects.get(pk=id).delete()
        if 'subparts_to_remove' in dict_report:
            for id in dict_report['subparts_to_remove']:
                ReportSubPart.objects.get(pk=id).delete()
        
        if dict_report['id']:
            try:
                report = Report.objects.get(pk=dict_report['id'])
                report.title = dict_report['title']
                report.updated_at = timezone.now()
            except:
                return JsonResponse({'message': "No report found with id "+str(dict_report['id'])}, status=400)
        else:
            report = Report(title=dict_report['title'])
        report.save()
        
        for order, part in enumerate(dict_report['parts']):
            status, message = save_report_part(part, report, order)
            if not status:
                return JsonResponse({'message': message}, status=400)
        return JsonResponse({'message': 'Report saved', 'id':report.pk}, status=200)
    return JsonResponse({'message': 'Failed to save report'}, status=400)

@csrf_exempt
def delete_report(request, report_id):
    try:
        report = Report.objects.get(id=report_id)
        report.delete()
        return JsonResponse({'message': 'Report deleted successfully.'}, status=200)
    except Report.DoesNotExist:
        return JsonResponse({'message': 'Report not found.'}, status=404)

@csrf_exempt
def save_report_styling(request, report_id):
    if request.method == 'POST':
        request_body = json.loads(request.body.decode('utf-8'))
        css_style = request_body.get('style', {})
        if not css_style:
            return JsonResponse({'message': 'No style in request body'}, status=400)

        try:    
            report = Report.objects.get(id=report_id)
            report.css_style = css_style
            report.save()
            return JsonResponse({'message': 'Styling saved'}, status=200)
        except Report.DoesNotExist:
            return JsonResponse({'message': 'Report not found'}, status=400)

def validate_json_report(report:dict, schema_static_path:str='grf/validators/report-schema.json'):
    schema_path = find(schema_static_path)
    if not schema_path:
        raise FileNotFoundError('No file found at static path '+schema_static_path)
    with open(schema_path, 'r') as file:
        report_schema = json.load(file)
    try:
        jsonschema.validate(report, report_schema)
        return True, ''
    except ValidationError as e:
        return False, e.message
    
def save_report_part(dict_part: dict, report: Report, order):
    if dict_part['id']:
        try:
            report_part = ReportPart.objects.get(pk=dict_part['id'])
            if report.pk != report_part.report.pk:
                return False, "Report part "+str(report_part.pk)+" already associated to report "+str(report_part.report.pk)
        except:
            return False, "No report part found with id "+str(dict_part['id'])
    else:
        report_part = ReportPart(report=report)

    report_part.title = dict_part['title']
    report_part.is_graded = dict_part['is_graded']
    report_part.is_included = dict_part['is_included']
    report_part.introduction = dict_part['introduction']
    report_part.order = order
    report_part.save()
    
    for order, subpart in enumerate(dict_part['subparts']):
        status, message = save_report_subpart(subpart, order, parent_part=report_part)
        if not status:
            return False, message
    return True, ''

def save_report_subpart(dict_subpart : dict, order:int, parent_part:ReportPart=None, parent_subpart:ReportSubPart=None):
    if dict_subpart['id']:
        try:
            report_subpart = ReportSubPart.objects.get(pk=dict_subpart['id'])
        except:
            return False, "No report subpart found with id "+str(dict_subpart['id'])
        if parent_part and parent_part.pk != report_subpart.parent_part.pk:
            return False, "Report subpart "+str(report_subpart.pk)+" already associated to report part "+str(report_subpart.parent_part.pk)
        if parent_subpart and parent_subpart.pk != report_subpart.parent_subpart.pk:
            return False, "Report subpart "+str(report_subpart.pk)+" already associated to report subpart "+str(report_subpart.parent_subpart.pk)
    else:
        report_subpart = ReportSubPart()

    if parent_subpart:
        report_subpart.parent_subpart = parent_subpart
    if parent_part:
        report_subpart.parent_part = parent_part
    report_subpart.title = dict_subpart['title']
    report_subpart.grade = dict_subpart['grade']
    report_subpart.is_included = dict_subpart['is_included']
    report_subpart.is_intro_included = dict_subpart['is_intro_included']
    report_subpart.introduction = dict_subpart['introduction']
    report_subpart.content = dict_subpart['content']
    report_subpart.order = order
    report_subpart.save()
    
    for order, subpart in enumerate(dict_subpart['subparts']):
        status, message = save_report_subpart(subpart, order, parent_subpart=report_subpart)
        if not status:
            return False, message
    return True, ''
