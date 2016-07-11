<?php
function myTwigExtension(\Twig_Environment &$twig) {
  $twig->addFunction(new \Twig_SimpleFunction('__', function($data){
      return $data;
  }));

  $twig->addFilter(new \Twig_SimpleFilter('strftime',function($item1,$item2){
      return strftime($item2,$item1);
  }));

  $twig->addFilter(new \Twig_SimpleFilter('strtotime',function($item1){
      return strtotime($item1);
  }));
  
  $twig->addFilter(
      new \Twig_SimpleFilter('str_pad', function($input, $padlength, $padstring=' ', $padtype=STR_PAD_RIGHT){
          return str_pad($input, $padlength, $padstring, $padtype);
      })
  );

}
