from django.urls import path
from . import views

urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("report/<int:id>", views.ReportView.as_view(), name="report"),
    path('save_report/', views.save_report, name='save_report'),
    path('delete_report/<int:report_id>/', views.delete_report, name='delete_report'),
    path("report/<int:id>/display", views.ReportDisplayView.as_view(), name="report-display"),
]
