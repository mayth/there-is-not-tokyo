(function () {
  'use strict';

  var appid = 'dj0zaiZpPUlUdzRUZXA4UHlnSyZzPWNvbnN1bWVyc2VjcmV0Jng9Nzc-';
  var endpoint = 'http://geo.search.olp.yahooapis.jp/OpenLocalPlatform/V1/geoCoder?callback=?';
  var re = /^東京都/;

  function parseQuery (query_str) {
    if (query_str.match(/^\?/)) {
      query_str = query_str.substring(1);
    }
    if (query_str.indexOf('=') === -1) {
      return decodeURIComponent(query_str);
    }
    var pairs = query_str.split('&');
    var params = {};
    pairs.forEach(function (p) {
      var kv_ary = p.split('=');
      var key = decodeURIComponent(kv_ary[0]);
      var val = decodeURIComponent(kv_ary[1]);
      if (key in params) {
        if (!Array.isArray(params[key])) {
          params[key] = [params[key]];
        }
        params[key].push(val);
      } else {
        params[key] = val;
      }
    });
    return params;
  }

  function generateShareLinks (place, result, mode) {
    $('#result-share-link').attr('href', generateLink(place, mode))
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

  function forecast (place, probability) {
    var text = place + 'は';
    if (probability === 0) {
      text += '東京ではない';
    } else if (probability === 100) {
      text += '東京である';
    } else {
      text += '' + probability + '%の確率で東京だろう';
    }
    $('#tokyo-result-primary').text(text);
    generateShareLinks(place, probability, 'forecast');
  }

  function generateLink (place, mode) {
    var protocol = document.location.protocol;
    var hostname = document.location.hostname;
    if (document.location.port != 80) {
      hostname += ':' + document.location.port;
    }
    var query = 'query=' + encodeURIComponent(place);
    if (mode == 'forecast') {
      query += '&mode=forecast';
    }
    return protocol + '//' + hostname + '?' + query;
  }

  function tokyoQuery (place, mode) {
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
        if (mode === 'forecast') {
          var n_tokyo = 0;
          result.Feature.forEach(function (item) {
            if (re.test(item.Name)) {
              ++n_tokyo;
            }
          });
          forecast(place, n_tokyo * 10);
        } else {
          var top_result = result.Feature[0];
          if (re.test(top_result.Name)) {
            itIsTokyo(place);
          } else {
            itIsNotTokyo(place);
          }
        }
      })
      .fail(function (err) {
        failJudgement(place);
      });
  }

  $(function () {
    var params = {params: 'judgement'};
    if (1 < document.location.search.length) {
      params = parseQuery(document.location.search);
      if (typeof(params) === 'string') {
        params = {query: params, mode: 'judgement'};
      }
      if (typeof(params.query) !== 'undefined' && params.query.trim() !== '') {
        var query = params.query.trim();
        var mode = ('mode' in params) ? params.mode.trim() : 'judgement';
        tokyoQuery(query, mode);
        $('#tokyo-query #place').val(query);
      }
    }
    $('#tokyo-query').submit(function (e) {
      e.preventDefault();
      var place = $('#tokyo-query #place').val().trim();
      if (place !== '') {
        tokyoQuery(place, params.mode);
      }
    });
  });
})();
