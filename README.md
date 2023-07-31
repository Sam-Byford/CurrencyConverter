# CurrencyConverter

Currency converter app built with Angular, using fixer API for conversions.

# About

The application takes user input and converts into the currency of their choice *

It uses rxjs for state management and reactive forms to handle data I/O.

The application utilises jasmine unit tests to test completeness. 

The app can also be found hosted on azure - http://sambyfordcurrencyconverter.azurewebsites.net/ *

# Limitations *

Due to only having the free tier of the fixer API, all conversions that do NOT use EUR route to a hardcoded data table to fetch the rates. This hardcoded table is accurate as of 30/07/2023.

Due to time constraints only 4 currencies are supported - USD, EUR, GBP and JPY. 

Note that the azure link uses HTTP and not HTTPS, again this is due to the free plan limitations that mean we cannot use secure fixer API calls. Therefore the app itself must also be unsecure to use HTTP links. 
