from django.db import models
import zlib

# Exercise 3 - Compress sequences (creating custom field for compressed text)
class CompressedTextField(models.TextField):

    # Decompressing functions for deserialization
    def from_db_value(self, value, expression, connection):
        if value is None or isinstance(value, str):
            return value
        return zlib.decompress(value).decode('utf-8')

    def to_python(self, value):
        if value is None:
            return value
        if isinstance(value, bytes):
            return zlib.decompress(value).decode('utf-8')
        return value

    # Compressing functions to load data in DB
    def get_prep_value(self, value):
        if value is None:
            return value
        return zlib.compress(value.encode('utf-8'))
    
    # Type assigned to the DB column
    def db_type(self, connection):
        return 'text'

class UniProtKBEntry(models.Model):
    accession = models.CharField(max_length=15, unique=True)
    name = models.CharField(max_length=20)
    reviewed = models.BooleanField()

    # Exercise 3 - Compress sequences

    sequence = CompressedTextField(null=True, blank=True)
    #sequence = models.TextField() #- now substituted with CompressedTextField (see migrations)

class InterProEntry(models.Model):
    accession = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=100)


class PfamEntry(models.Model):
    accession = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=100)
    interpro_entry = models.ForeignKey(InterProEntry, null=True,
                                       on_delete=models.SET_NULL)

class PfamMatch(models.Model):
    protein = models.ForeignKey(UniProtKBEntry, on_delete=models.CASCADE)
    model = models.ForeignKey(PfamEntry, on_delete=models.CASCADE)
    start = models.IntegerField()
    stop = models.IntegerField()
