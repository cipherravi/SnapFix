function welcomeEmail(username) {
  return `
 <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Welcome to SnapFix</title>
</head>
<body style="margin:0; padding:0; background:#eef2f7; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:40px 0;">

    <!-- HEADER SECTION -->
        <tr>
        <td style="background:#4A90E2; padding:30px 20px; text-align:center; color:#ffffff; border-top-left-radius:14px; border-top-right-radius:14px;">

            <!-- Centered inline block container -->
            <table cellpadding="0" cellspacing="0" align="center" style="display:inline-block; margin-bottom:8px;">
            <tr>

                <!-- Heading -->
                <td style="vertical-align:middle;">
                <h1 style="margin:0; font-size:32px; font-weight:800; letter-spacing:1px; color:#ffffff;">
                    SnapFix
                </h1>
                </td>

                <!-- Logo (right side) -->
                <td style="vertical-align:middle;">
                <img src="https://otmijatepfbjhlptqbej.supabase.co/storage/v1/object/public/SnapFix/staticAssets/SnapFix.png" 
                    alt="SnapFix Logo"
                    style="width:55px; height:auto; border-radius:8px; display:block;" />
                </td>

            </tr>
            </table>

            <!-- Tagline -->
            <p style="margin:4px 0 0; font-size:17px; opacity:0.9; color:#ffffff;">
            Job Marketplace • Talent Meets Opportunity
            </p>

        </td>
        </tr>


          <!-- BODY SECTION -->
          <tr>
            <td style="padding:35px 28px; color:#333;">
              
              <h2 style="margin:0 0 18px; font-size:22px; font-weight:600; white-space:nowrap;">Welcome aboard ${username}!&nbsp;🎉</h2>


              <p style="line-height:1.7; font-size:15px; margin:0 0 15px;">
                We're thrilled to have you join <strong style="color:#000;">SnapFix</strong> — a platform built to connect skilled talent with meaningful job opportunities.
              </p>

              <p style="line-height:1.7; font-size:15px; margin:0 0 20px;">
                Whether you're here to find the right job or hire the right people, 
                you're now part of a growing community where skill, passion, and opportunity come together.
              </p>

              <!-- Highlight Box -->
              <div style="background:#f0f6ff; padding:18px; border-left:4px solid #4A90E2; border-radius:6px; margin:25px 0;">
                <p style="margin:0; font-size:14px; line-height:1.6;">
                  🌟 <strong style="color:#000;">Your account is now ready.</strong><br>
                  Start exploring opportunities matched to your skills — or post jobs if you're looking to hire!
                </p>
              </div>

              <!-- Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="https://trysnapfix.in" 
                   style="background:#4A90E2; color:#ffffff; padding:14px 32px; text-decoration:none; 
                          font-size:16px; font-weight:600; border-radius:8px; display:inline-block;">
                  Get Started Now
                </a>
              </div>

              <p style="line-height:1.7; font-size:14px; color:#555;">
                If you ever need assistance, our support team is always happy to help you.
              </p>

              <p style="font-size:14px; color:#777; margin-top:25px;">
                Cheers,<br/>
                The SnapFix Team 💙
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f5f7fa; text-align:center; padding:14px; font-size:12px; color:#888;">
              © ${new Date().getFullYear()} SnapFix. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;
}

module.exports = welcomeEmail;
