# URL Translator App


The URL Translator app is responsible for automatically listening to the broadcaster events and creating the translated URL in the rewriter app in VTEX. 

## In order to use this app, you have to change some files first. You have to:

1) Update vendor in manifest.json

2) Update vendor in events > update > sender > in service.json

3) Update vendor in parseAndValidate> events.sendEvent in parse.ts

## After linking the app 
Go to your dev workspace admin, in the following path `/admin/apps/{{vendor}}.url-translater-auto@0.0.0/setup/`, in which you have to include the bindingId in which you want to store the translated URLs and the locale of the translations.

![URL Auto Translate](https://github.com/edubarbo/URL-Translator/assets/111549347/c672b664-f363-45c6-a73e-9abf9971b817)

FYI: If you’re using a workspace dev to test the translations first, you have to configure the broadcaster to send the events to this specific development workspace with the Notify Target Workspace setting. You can find more info about that in the following link: https://github.com/vtex-apps/broadcaster


