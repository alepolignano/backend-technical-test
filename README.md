# Back-end technical test

This repository is a small web application built with [Django](https://www.djangoproject.com/) 
and [Django REST Framework](https://www.django-rest-framework.org) 
to browse InterPro entries, Pfam models, and UniProtKB proteins.

InterPro, Pfam, and UniProt are three integral resources in the realm of bioinformatics, 
each playing a distinct yet interconnected role in deciphering the complex language of proteins.

InterPro serves as a comprehensive resource for protein classification, amalgamating information 
from various databases like Pfam. Pfam, in turn, provides detailed models of protein families 
and domains derived from multiple sequence alignments, with its sequence data sourced from UniProtKB.

## Getting started

You need Python 3.10 or higher. Run the following commands to install depencies, 
create a SQLite database, populate it with fixture data, and start the server.

```sh
pip install -r requirements.txt
cd seqfam
python manage.py migrate
python manage.py loaddata
python manage.py runserver
```

Once that the server is running, visit [http://127.0.0.1:8000/](http://127.0.0.1:8000/) with your web browser.

## Exercise 1: count each protein once - Solution [1](https://github.com/alepolignano/backend-technical-test/blob/master/seqfam/seqfamapp/serializers.py#L5), [2](https://github.com/alepolignano/backend-technical-test/blob/master/seqfam/seqfamapp/serializers.py#L57) 

InterPro entries integrate protein families and domains from various databases, such as Pfam, and 
Pfam entries annotate one or multiple sequences in UniProtKB.

However:

* A single Pfam entry can have more than one annotation for the same protein
* Two or more Pfam entries can annotate the same protein

The [http://127.0.0.1:8000/interpro](http://127.0.0.1:8000/interpro) page lists 
the InterPro entries in the database and, for each InterPro entry, the number of annotated proteins is provided.

The project currently doesn't display the correct number. Indeed, instead of the number of proteins, 
the number of individual Pfam annotations is displayed, which means that some proteins are counted more than once.

**Task:** provide a fix so that each protein associated with an InterPro entry is counted only once,
regardless of the number of annotations it receives from Pfam entries.



## Exercise 2: implement a detailed endpoint for InterPro entries - Solution [1](https://github.com/alepolignano/backend-technical-test/blob/master/seqfam/seqfamapp/serializers.py#L69)

**Task:** create a detailed endpoint that retrieves information about an InterPro entry based on its accession. 
The endpoint should return the following properties:

* `accession`: the unique identifier for the InterPro entry
* `name`: the name or label associated with the InterPro entry
* `description`: a brief description of the InterPro entry
* `pfam`: the list of Pfam accessions integrated in the InterPro entry
* `uniprot`: the list of unique UniProtKB protein accessions that are associated with the InterPro entry via Pfam.

The endpoint should be made available at `/api/interpro/<accession>`, 
e.g. [/api/interpro/IPR016087](http://127.0.0.1:8000/api/interpro/IPR016087).

## Exercise 3: compress sequences

Protein sequences can be lengthy, and storing them uncompressed can consume significant database storage, 
especially when dealing with large datasets (hundreds of millions of sequences).
Currently, the project stores protein sequences in a database table without compression.

**Task:** update the project so sequences are stored using gzip compression. 
Additionally, create a custom migration script to compress the existing sequences in the database.

## Exercise 4: sequence length

The [uniprot](http://127.0.0.1:8000/uniprot) page lists all UniProtKB entries in the database.
The fourth column is the length of the sequence.
The [/api/uniprot](http://127.0.0.1:8000/api/uniprot) endpoint, where the data is fetched from, returns the full sequence of each protein.
This is inefficient, as we only need the length.

**Task:** update the project so the length is returned instead of the sequence.

## Exercise 5: not all proteins at once

The [/api/uniprot](http://127.0.0.1:8000/api/uniprot) endpoint returns all UniProtKB entries in the database, 
which can be inefficient with large datasets. 

**Task:** update the endpoint to handle large datasets efficiently.

## Exercise 6: use InterPro accessions, not primary keys

The [pfam](http://127.0.0.1:8000/pfam) page lists all Pfam entries in the database.
For each Pfam entry, the last column should display the accession of the InterPro entry in which the Pfam entry is integrated, if integrated.
However, instead of showing InterPro accessions, the column currently displays the primary keys of InterPro entries in the database.

**Task:** fix the [/api/pfam](http://127.0.0.1:8000/api/pfam) endpoint so it returns InterPro accessions instead of primary keys.
