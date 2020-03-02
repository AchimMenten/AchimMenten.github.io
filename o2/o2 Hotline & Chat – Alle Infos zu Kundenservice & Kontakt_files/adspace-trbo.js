document.addEventListener("DOMContentLoaded", function (event) {
  // get Timeout from localSettings. Default Value 1000ms
  var getTimeout = function () {
    var timeout = $("#trbo_adspace_fallback").data("timeout");
    if (!timeout) {
      timeout = 1000;
    }
    return timeout;
  };

  // cleanup when itemcollection, sectioncollection and inner have no childrens
  var cleanUpWhenNoChildrens = function ($itemcollection) {
    //Check if ItemCollection has true children  --> children only with class headline = no children
    var hasTrueChildren = false;
    $itemcollection.children().each(function () {
      if ($(this).attr('class') !== 'headline') {
        hasTrueChildren = true;
      }
    });

    //Remove ItemCollection when no children or only children with class=headline
    if (!hasTrueChildren) {
      var $inner = $itemcollection.parent();
      $itemcollection.remove();

      //Remove inner when no children
      if ($inner.children().length === 0) {
        var $section = $inner.parent();
        $inner.remove();

        //Remove section when no children
        if ($section.children().length === 0) {
          $section.remove();
        }
      }
    }
  };

  // do fallback
  var handleAdspaces = function () {
    $('[data-js*="adspace-trbo"]').each(function () {
      // show fallback
      var $fallbackContent = $(this).children().not('div.loader');
      if ($fallbackContent.length > 0) {
        $(this).replaceWith($fallbackContent);
      }
      // hides parent wrapper, when empty (no trbo ad and no fallback)
      var isAdspaceHide = $(this).hasClass('hide');
      if (isAdspaceHide) {
        var $parent = $(this).parent();
        $(this).remove();

        var childrenLength = $parent.children().length;
        if (childrenLength === 0) {
          var $itemCollection = $parent.parent();
          $parent.remove();

          cleanUpWhenNoChildrens($itemCollection);
        }
      }
    });
  };

  // after timeout handle Adspaces (show fallback or hide parent)
  window.setTimeout(function () {
    if (document.location.href.indexOf('trppids') === -1) {
      handleAdspaces();
    }
  }, getTimeout());
});