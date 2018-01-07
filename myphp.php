<?php
	if (isset($_POST["submit"])) {
		$expName = $_POST['expName'];
		$tubesEnabled = $_POST['tubesEnabled'];

		if (!$_POST['expName']) {
			$errName = 'Please enter an experiment name.';
		}

		if (!$_POST['tubesEnabled']) {
			$errTubes = 'Please enable at least 1 tube.';
		}

	if (!$errName && !$errTubes) {
		
		$result='<div class="alert alert-success">Thank You! I will be in touch</div>';
	} else {
		$result='<div class="alert alert-danger">Sorry there was an error. Please try again later</div>';
	}

?>
	