(function(window, undefined){
  'use strict';

  window.shareContent = flight.component(function(){
    this.attributes({
      url: "",
      twitterHandle: '', // Add your twitter handle here
      twitterHashtags: '', // Add your tags here
      modalOptions: 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
    });

    this.after('initialize', function() {
      if(this.$node.find('[data-share-url]').length > 0){
        this.attr.url = this.$node.find('[data-share-url]').data('share-url');
      }

      if(this.$node.data('anchor') !== undefined){
        this.attr.url += '#' + this.$node.data('anchor');
      }

      if(this.attr.url === "") {
        this.attr.url = window.location.href;
      }

      this.twitterLink = this.$node.find('[data-share-network=twitter]');
      this.facebookLink = this.$node.find('[data-share-network=facebook]');
      this.linkedinLink = this.$node.find('[data-share-network=linkedin]');
      this.emailLink = this.$node.find('[data-share-network=email]');

      if(this.twitterLink)
        this.twitterLink.on('click', this.clickTwitterHandle.bind(this));

      if(this.facebookLink)
        this.facebookLink.on('click', this.clickFacebookHandle.bind(this));

      if(this.linkedinLink)
        this.linkedinLink.on('click', this.clickLinkedinHandle.bind(this));

      if(this.emailLink.length)
        this.emailLink.on('click', this.clickEmailHandle.bind(this));
    });

    this.clickTwitterHandle = function(e) {
      e.preventDefault();
      try {
        var twitter_intent_url = 'https://twitter.com/intent/tweet?text=' + this.shareText();
        if (this.attr.twitterHashtags != undefined) {
          var tags = this.attr.twitterHashtags.split(',');
          var finalTags = [];
          var text = this.shareText();
          tags.forEach(function(tag){
            if(text.indexOf(tag) === -1){
              finalTags.push(tag);
            }
          });
          twitter_intent_url += '&hashtags= ' + finalTags.join(',');
        }
        twitter_intent_url += '&url=' + encodeURIComponent(this.attr.url);
        if(this.attr.twitterHandle !== '')
          twitter_intent_url += '&via=' + this.attr.twitterHandle;

        window.open(twitter_intent_url, '', this.attr.modalOptions);

      } catch(missingShareTextNode) {
        console.log('Error: missing share Text Node');
      }
    };

    this.clickFacebookHandle = function(e) {
      e.preventDefault();
      window.open('http://www.facebook.com/sharer/sharer.php?u='+ encodeURIComponent(this.attr.url), '', this.attr.modalOptions);
    };

    this.clickLinkedinHandle = function(e) {
      e.preventDefault();

      window.open('https://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent(this.attr.url)+'&title=' + this.shareText(), '', this.attr.modalOptions);
    };

    this.clickEmailHandle = function(e) {
      e.preventDefault();
      try {
        window.location.href = 'mailto:?subject=Recommended article&body=' + this.shareText() + ' ' + encodeURIComponent(this.attr.url);
      } catch(missingShareTextNode) {
        console.log('Error: missing share Text Node');
      }
    };

    this.shareText = function(){
      var text;
      var textNode = this.$node.find('[data-share-text]');

      if (!textNode.length) {
        textNode = $('h1');
      }

      if(textNode.length && textNode.data('share-text') !== undefined) {
        text = textNode.data('share-text');
      } else if (textNode.length) {
        text = textNode.html();
      } else {
        text = window.document.title;
      }

      if(text.length > 101) {
        text = text.substring(0,101) + '…';
      }
      return text;

    };

  });

})(window);
