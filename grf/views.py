from django.shortcuts import render
from django.views import generic
from .models import Report, Template

class IndexView(generic.TemplateView):
    template_name = 'index.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['all_reports'] = Report.objects.all()
        context['all_templates'] = Template.objects.all()
        return context

class ReportView(generic.DetailView):
    model = Report
    template_name = 'report/edit.html'
    
    def get_object(self, queryset=None):
        id = self.kwargs.get("id")
        return Report.objects.get(pk=id)

class ReportCreateView(generic.CreateView):
    model = Report
    template_name = 'report/create.html'

class TemplateView(generic.DetailView):
    model = Template
    template_name = 'template/edit.html'
    
    def get_object(self, queryset=None):
        id = self.kwargs.get("id")
        return Template.objects.get(pk=id)

class SettingsView(generic.UpdateView):
    template_name = 'settings.html'
    