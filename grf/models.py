from django.db import models
from django.utils import timezone


class Report(models.Model):
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    template = models.ForeignKey('self', on_delete=models.DO_NOTHING, null=True)
    
    def create_default(apps, schema_editor):
        report_ex = Report.objects.create(title='Report Example')
        part1 = ReportPart.objects.create(report=report_ex, title='Part 1', order=1)
        ReportPart.objects.create(report=report_ex, title='Part 2', order=2)
        subpart = ReportSubPart.objects.create(parent_part=part1, title='SubPart', order=1)
        ReportSubPart.objects.create(parent_subpart=subpart, title='SubSubPart', order=1)

    def to_html(self):
        return

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
