import json
from django.views import generic
import jsonschema
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

class ReportCreateView(generic.CreateView):
    model = Report
    template_name = 'report/create.html'

class SettingsView(generic.UpdateView):
    template_name = 'settings.html'


@csrf_exempt
def save_report(request:HttpRequest):
    if request.method == 'POST':
        request_body = json.loads(request.body.decode('utf-8'))
        dict_report = request_body.get('report', {})
        is_valide, validation_message = validate_json_report(dict_report)
        if not is_valide:
            return JsonResponse({'message': validation_message}, status=400)      
        return JsonResponse({'message': 'Report saved'}, status=200)
    return JsonResponse({'message': 'Failed to save report'}, status=400)

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
    
