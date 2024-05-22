from django.shortcuts import render
from rest_framework import viewsets

from .models import UniProtKBEntry, InterProEntry, PfamEntry
from .serializers import UniProtKBSerializer, InterProSerializer, PfamSerializer, InterProEntrySerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.pagination import PageNumberPagination


# Exercise 6 - not all proteins at once

# Implementing custom pagination for the view
class UniProtKBCustomPagination(PageNumberPagination):
    page_size = 10  
    page_size_query_param = 'page_size'
    max_page_size = 100

class UniProtKBViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UniProtKBEntry.objects.all()
    serializer_class = UniProtKBSerializer
    
    # Applying pagination to the view
    pagination_class = UniProtKBCustomPagination

class InterProViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InterProEntry.objects.all()
    serializer_class = InterProSerializer

class PfamViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PfamEntry.objects.all()
    serializer_class = PfamSerializer

class InterProEntryView(APIView):

    def get(self, request, accession):
        interpro_entry = get_object_or_404(InterProEntry, accession=accession)
        interpro_entry_serialized = InterProEntrySerializer(interpro_entry)
        return Response(interpro_entry_serialized.data, status=status.HTTP_200_OK)


def interpro_list(request):
    context = {"page_title": "InterPro"}
    return render(request, "list.html", context)


def pfam_list(request):
    context = {"page_title": "Pfam"}
    return render(request, "list.html", context)


def uniprot_list(request):
    context = {"page_title": "Proteins"}
    return render(request, "list.html", context)
