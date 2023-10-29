# Generated by Django 4.2.5 on 2023-10-29 12:43

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone

from grf.models import Report


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('template', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='grf.report')),
            ],
        ),
        migrations.CreateModel(
            name='ReportPart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField(null=True)),
                ('is_graded', models.BooleanField(default=True)),
                ('title', models.CharField(max_length=200)),
                ('introduction', models.TextField(default='')),
                ('report', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='grf.report')),
            ],
        ),
        migrations.CreateModel(
            name='ReportSubPart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField(null=True)),
                ('title', models.CharField(max_length=200)),
                ('is_included', models.BooleanField(default=True)),
                ('grade', models.PositiveIntegerField(null=True)),
                ('introduction', models.TextField(default='')),
                ('is_intro_included', models.BooleanField(default=True)),
                ('content', models.TextField(default='')),
                ('parent_part', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='grf.reportpart')),
                ('parent_subpart', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='grf.reportsubpart')),
            ],
        ),
        migrations.RunPython(Report.create_default)
    ]
