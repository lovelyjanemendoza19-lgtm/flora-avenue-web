<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Profile | Flora Avenue</title>
	<link rel="stylesheet" href="../../public/css/style.css">
	<link rel="stylesheet" href="../../public/css/profile.css">
</head>
<body data-navigation-base="../../">
	<div class="website">
		<header>
			<button class="menu-button" id="menuButton" aria-label="Open menu">☰</button>
			<div class="logo">
				<img src="../../public/images/logo.png" alt="Flora Avenue Logo">
			</div>
		</header>
		<main class="profile-page">
			<section class="profile-card" aria-labelledby="profile-title">
				<div class="profile-avatar profile-avatar-placeholder" aria-label="Profile photo placeholder">Photo</div>
				<div class="profile-heading">
					<p class="profile-eyebrow">MY PROFILE</p>
					<h1 id="profile-title">Flora Avenue Customer</h1>
					<p class="profile-status">Welcome to your profile page.</p>
				</div>

				<div class="profile-details">
					<div class="profile-detail">
						<span>Name</span>
						<strong data-profile-value="name">Flora Avenue Customer</strong>
						<input class="profile-input" data-profile-input="name" type="text" value="Flora Avenue Customer" aria-label="Name">
					</div>
					<div class="profile-detail">
						<span>Email</span>
						<strong data-profile-value="email">customer@example.com</strong>
						<input class="profile-input" data-profile-input="email" type="email" value="customer@example.com" aria-label="Email">
					</div>
					<div class="profile-detail">
						<span>Contact Number</span>
						<strong data-profile-value="contact">Not provided</strong>
						<input class="profile-input" data-profile-input="contact" type="tel" value="" placeholder="Not provided" aria-label="Contact Number">
					</div>
				</div>

				<div class="profile-actions">
					<button class="profile-action" id="editProfileButton" type="button">Edit Profile</button>
					<button class="profile-action profile-cancel" id="cancelProfileButton" type="button">Cancel</button>
					<button class="profile-action" id="saveProfileButton" type="button">Save Profile</button>
				</div>
			</section>
		</main>
	</div>
	<script src="../../public/js/navigation.js"></script>
	<script src="../../public/js/script.js"></script>
	<script src="../../public/js/profile.js"></script>
</body>
</html>