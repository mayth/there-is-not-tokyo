(function () {
  'use strict';

  var appid = 'dj0zaiZpPUlUdzRUZXA4UHlnSyZzPWNvbnN1bWVyc2VjcmV0Jng9Nzc-';
  var endpoint = 'http://geo.search.olp.yahooapis.jp/OpenLocalPlatform/V1/geoCoder?callback=?';
  var re = /^東京都/;

  function generateShareLinks (place, result) {
    $('#result-share-link').attr('href', generateLink(place))
                           .text('判定結果へのリンク');
  }

  function itIsTokyo (place) {
    $('#tokyo-result-primary').text('そこは東京である');
    generateShareLinks(place, true);
  }

  function itIsNotTokyo (place) {
    $('#tokyo-result-primary').text('そこは東京ではない');
    generateShareLinks(place, false);
  }

  function itSeemsNonPlaceName (place) {
    $('#tokyo-result-primary').text('そもそも地名ではない');
    generateShareLinks(place, false);
  }

  function failJudgement (place) {
    $('#tokyo-result-primary').text('判定失敗');
  }

  function generateLink (place) {
    var protocol = document.location.protocol;
    var hostname = document.location.hostname;
    if (document.location.port != 80) {
      hostname += ':' + document.location.port;
    }
    return protocol + '//' + hostname + '?' + encodeURIComponent(place);
  }

  function tokyoQuery (place) {
    $.getJSON(endpoint, {
      appid: appid,
      query: place,
      output: 'json'
    })
      .done(function (result) {
        if (result.ResultInfo.Status != 200) {
          failJudgement(place);
          console.log('api error: ' + result.ResultInfo.Status);
          return;
        }
        if (result.ResultInfo.Count === 0) {
          console.log('no result returned');
          return;
        }
        var top_result = result.Feature[0];
        if (re.test(top_result.Name)) {
          itIsTokyo(place);
        } else {
          itIsNotTokyo(place);
        }
      })
      .fail(function (err) {
        failJudgement(place);
      });
  }

  $(function () {
    if (1 < document.location.search.length) {
      var query_str = decodeURIComponent(document.location.search.substring(1));
      tokyoQuery(query_str);
      $('#tokyo-query #place').val(query_str);
    }
    $('#tokyo-query').submit(function (e) {
      e.preventDefault();
      var place = $('#tokyo-query #place').val();
      tokyoQuery(place);
    });
  });
})();
