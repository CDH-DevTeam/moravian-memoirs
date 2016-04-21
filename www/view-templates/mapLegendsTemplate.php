<script type="text/template" id="mapLegendsTemplate">

	<div class="legends-item">
		<div class="circle" style="width: <%= ((minValue/maxValue)*30)+2 %>px; height: <%= ((minValue/maxValue)*30)+2 %>px"></div>
		<div class="label"><%= Math.round(minValue) %></div>
	</div>

	<div class="legends-item">
		<div class="circle" style="width: <%= ((Math.round((minValue+maxValue)/2)/maxValue)*30)+2 %>px; height: <%= ((Math.round((minValue+maxValue)/2)/maxValue)*30)+2 %>px"></div>
		<div class="label"><%= Math.round((minValue+maxValue)/2) %></div>
	</div>

	<div class="legends-item">
		<div class="circle" style="width: <%= 32 %>px; height: <%= 32 %>px"></div>
		<div class="label"><%= Math.round(maxValue) %></div>
	</div>

</script>