# Generated by Django 2.1.5 on 2019-01-19 15:41

import jsonfield.encoder
import jsonfield.fields
from django.db import migrations, models


def clear_history(apps, schema_editor):
    """
    Deletes the full history.
    """
    # We get the model from the versioned app registry;
    # if we directly import it, it will be the wrong version.
    History = apps.get_model("core", "History")
    History.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_auto_20190119_1425'),
    ]

    operations = [
        migrations.AddField(
            model_name='history',
            name='restricted',
            field=models.BooleanField(default=False),
        ),
        migrations.RunPython(clear_history),
        migrations.AlterField(
            model_name='history',
            name='information',
            field=jsonfield.fields.JSONField(dump_kwargs={'cls': jsonfield.encoder.JSONEncoder, 'separators': (',', ':')}, load_kwargs={}),
        ),
    ]
