<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your Ticket Offer is Ready</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f9;
      padding: 20px;
      color: #333;
    }
    .container {
      background: #fff;
      border-radius: 8px;
      padding: 30px;
      max-width: 600px;
      margin: auto;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .button {
      background-color: #4f46e5;
      color: white;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 6px;
      display: inline-block;
      margin-top: 20px;
    }
    .footer {
      font-size: 12px;
      color: #999;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>🎉 You're Next in Line!</h2>
    <p>Hello {{ $user->name }},</p>

    <p>Good news! Your turn has come up in the queue for <strong>{{ $event->name }}</strong>.</p>

    <p>You now have an exclusive opportunity to purchase a ticket. Please complete your purchase before your offer expires.</p>

    <p><strong>Offer Expiry Time:</strong> {{ $expires }}</p>

    <a href="{{ $purchase_url }}" class="button">Purchase Ticket Now</a>

    <p>If you don’t complete your purchase within the given time, the ticket will be offered to the next person in line.</p>

    <p>Thanks,<br>The {{ config('app.name') }} Team</p>

    <div class="footer">
      If you did not request this, you can safely ignore this email.
    </div>
  </div>
</body>
</html>
