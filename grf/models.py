from django.db import models
from django.utils import timezone


def get_report_styling_file_content():
    file_path = 'grf/static/grf/css/report-display.css'
    with open(file_path, 'r') as f:
        return f.read()

class Report(models.Model):
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    template = models.ForeignKey('self', on_delete=models.DO_NOTHING, null=True)
    css_style = models.TextField(default=get_report_styling_file_content)

class ReportPart(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE)
    order = models.PositiveIntegerField()
    is_graded = models.BooleanField(default=True)
    is_included = models.BooleanField(default=True)
    title = models.CharField(max_length=200)
    introduction = models.TextField(default='')

class ReportSubPart(models.Model):
    parent_part = models.ForeignKey(ReportPart, on_delete=models.CASCADE, null=True)
    parent_subpart = models.ForeignKey('self', on_delete=models.CASCADE, null=True)
    order = models.PositiveIntegerField(null=True)
    title = models.CharField(max_length=200)
    is_included = models.BooleanField(default=True)
    grade = models.PositiveIntegerField(null=True)
    introduction = models.TextField(default='')
    is_intro_included = models.BooleanField(default=True)
    content = models.TextField(default='')
