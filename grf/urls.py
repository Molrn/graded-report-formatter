from django.urls import path
from . import views

urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("(report/?P<pk>[0-9]+)/display", views.ReportView.as_view(), name="report-display"),
    path("(report/?P<pk>[0-9]+)/edit", views.ReportEditView.as_view(), name="report-edit"),
    path("(report/create", views.ReportView.as_view(), name="report-create"),
    path("settings", views.SettingsView.as_view(), name="settings"),
]
