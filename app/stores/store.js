define(['knockout'], function(ko) {
    return {
        tokens: ko.observableArray(),
        knowledgeGraphs: ko.observableArray(),
        keyIndicators: ko.observableArray(),
        keyIndicatorFeatures: ko.observableArray(),
    };
});
