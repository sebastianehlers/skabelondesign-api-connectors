({
    generateDocument : function(component, event, helper) {
        //Config
        var templateId = 'template id here';        
        var getJsonDataComponent = component.get('c.getAccountWithContactsAndCasesAsJson');
        var generateDocumentComponent = component.get('c.generateDocumentFromTemplate');
        var accountId = component.get('v.recordId');
                
        getJsonDataComponent.setParams ({recordId: accountId});
        getJsonDataComponent.setCallback(this, function(data) 
        {
            //Generate document
            var jsonData = data.getReturnValue();
            generateDocumentComponent.setParams
            ({
                templateId: templateId,
                dataJson: jsonData,
                responseType: 'string'
            });
            $A.enqueueAction(generateDocumentComponent);
        });
        generateDocumentComponent.setCallback(this, function(response){
            var state = response.getState();
            if(state === 'SUCCESS' && component.isValid())
            {
                //Download the new document
                var binary_string = window.atob(response.getReturnValue());
                var len = binary_string.length;
                var bytes = new Uint8Array(len);
                for (var i = 0; i < len; i++)
                    bytes[i] = binary_string.charCodeAt(i);
                
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(new Blob([bytes.buffer]));
                link.download = "Document.docx"
                link.click();
                URL.revokeObjectURL(link.href);                        
            }
        });
        $A.enqueueAction(getJsonDataComponent);
    }
})