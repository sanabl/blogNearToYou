
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, Row, Column, Field, Div, HTML
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.forms import ModelForm
from blog.models import User, UserProfile
from django.utils.translation import gettext_lazy as _


class UserForm(UserCreationForm):
    error_messages = {
        "email_exists": _("البريد الالكتروني موجود مسبقا"),
        "username_exists": _("الاسم موجود مسبقا ."),
        "password_mismatch": _("الرقم السري غير متطابق."),
    }
    first_name = forms.CharField(widget=forms.TextInput(
        attrs={
            'class': 'form-control',
            'dir': 'rtl',
            'placeholder': 'الاسم الاول'
        }
    ))

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'username', 'email', 'password1', 'password2')
        widgets ={}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.fields['first_name'].label='الإسم الأول'
        self.fields['last_name'].label='اسم العائلة'
        self.fields['username'].label='الاسم'
        self.fields['email'].label='البريد الالكتروني'
        self.fields['password1'].label='الرقم السري'
        self.fields['password2'].label='تأكيد الرقم السري'
        self.helper.layout = Layout(
            Div(HTML('<h1>تسجيل </h1>')),
            Div(
            Row(Column('first_name', css_class='form-group col-md-6', label_class='form-label'),
                Column('last_name', css_class='form-group col-md-6')),
            Row(Column('username', css_class='form-group col-md-6'),
                Column('email', css_class='form-group col-md-6')),
            Row(Column('password1', css_class='form-group col-md-6'),
                Column('password2', css_class='form-group col-md-6')),
            Row(Submit('submit', 'Register'), css_class='justify-content-center'), css_class='register_form')
        )

    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exists():
            raise ValidationError(UserForm.error_messages.get('email_exists'), code='email_exists')
        return email

class UserProfileForm(ModelForm):
    class Meta:
        model = UserProfile
        exclude = ('User',)
