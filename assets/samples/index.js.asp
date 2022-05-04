<!-- #include file="include/utilities.js.asp" -->
<!-- #include virtual="Desktop/Virtual/test.js.asp" -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <title>
  <link href="/include/test.css" />

  <style>
    .foo {
      background-color: beige;
      position: absolute;


    }
  </style>
  <div>

  </div>

</head>
<body>
<div>
	<%
	foo("bar");

	Response.Write("foo");

	VirtualFoo();

	%>
</div>

  <div class="foo">

  <table>
  <div class="foo"></div>
  <script>
    function foo(bar) {

    }

    foo();
  </script>
</body>
</html>
