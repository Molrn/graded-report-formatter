from django.urls import path
from . import views

urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("report/<int:id>", views.ReportView.as_view(), name="report"),
    path("report/create", views.ReportCreateView.as_view(), name="report-create"),
    path("settings", views.SettingsView.as_view(), name="settings"),
]
