from rest_framework import serializers
from .models import UniProtKBEntry, InterProEntry, PfamEntry, PfamMatch

"""
    - Exercise nr.1: count each protein once

    This is done by:
    - Retrieving the list of PFAM entries associated with a specific InterPro entry (could be more than 1)
    - Retrieving all the PFAM matches that use the model_ids in the list retrieved at the previous point
    - Once all the matches are found, a set of those is computed. If there's any duplicate protein_id (id of the UniProtKB table), it will get removed.
    - If only the protein count is needed, the length of the set is then computed and returned as a result. 
       o This function gets also reused in exercise 2 to return the list of UniProtKB accessions associated with an InterProEntry.

    Note:
        The sum of the counts is still not equal to the number of proteins in the UniProtKB table.
        This is because some InterPro entries overlap, in terms of associated proteins in the UniProtKB table.
        The assignment specifies that the fix is about ONE specific entry though, so it shouldn't be a problem.
"""

def get_unique_uniprot_info(interpro_entry_id, count_only = False):
        
    pfam_entries = PfamEntry.objects.filter(interpro_entry=interpro_entry_id).values_list("id", flat=True)
    pfam_matches = PfamMatch.objects.filter(model__in=pfam_entries).values_list("protein_id", flat=True)
    unique_pfam_matches = set(pfam_matches)

    if (count_only):

        protein_count_no_fix = len(pfam_matches)
        protein_count = len(unique_pfam_matches)

        count_string = str(protein_count)

        if (protein_count != protein_count_no_fix):
            count_string += f""" \n ({protein_count_no_fix} without fix)"""
        
        return count_string
    
    # Get accessions from UniProtKB table
    uniprot_accessions = UniProtKBEntry.objects.filter(id__in=unique_pfam_matches).values_list("accession", flat=True)
    return uniprot_accessions


class UniProtKBSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniProtKBEntry
        fields = '__all__'


class InterProSerializer(serializers.ModelSerializer):
    protein_count = serializers.SerializerMethodField()

    class Meta:
        model = InterProEntry
        fields = '__all__'

    def get_protein_count(self, obj):
            return get_unique_uniprot_info(obj, count_only=True)


class PfamSerializer(serializers.ModelSerializer):
    class Meta:
        model = PfamEntry
        fields = '__all__'
