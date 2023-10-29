from django.views import generic
from .models import Report, ReportPart, ReportSubPart

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
