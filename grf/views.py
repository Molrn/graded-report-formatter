from django.shortcuts import render
from django.views import generic
from .models import Report

class IndexView(generic.ListView):
    template_name = 'index.html'
    
    def get_queryset(self):
        return Report.objects.all()

class ReportView(generic.DetailView):
    model = Report
    template_name = 'report/display.html'

class ReportEditView(generic.UpdateView):
    model = Report
    template_name = 'report/edit.html'

class ReportCreateView(generic.CreateView):
    model = Report
    template_name = 'report/create.html'    

class SettingsView(generic.UpdateView):
    template_name = 'settings.html'
    