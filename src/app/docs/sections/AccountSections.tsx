import {
  DocSection, DocH2, DocP,
  Sig, Code, CodeBlock, Callout,
  DocTable, DocUl, Divider,
} from "../components";

function AccountSections() {
  return (
    <>
      <DocSection id="twofa-overview">
        <DocH2>Two-factor authentication</DocH2>
        <DocP>
          Your users can protect their account with any standard authenticator app —
          Google Authenticator, Authy, 1Password, Bitwarden. Evora implements TOTP
          (RFC 6238): six digits, thirty-second step, no third-party service in the path.
        </DocP>
        <DocP>
          You choose the policy per application under{" "}
          <Code>Settings → Access policies → Two-factor authentication</Code>:
        </DocP>
        <DocTable
          headers={["Policy", "Behaviour"]}
          rows={[
            ["Disabled", "Nobody can enrol. Existing enrolments are ignored at login."],
            ["Optional", "Users may enrol. Those who have are challenged; those who have not sign in normally. This is the default."],
            ["Required", "Sign-in is refused with TWOFA_ENROLMENT_REQUIRED until the user enrols. Users cannot turn it back off."],
          ]}
        />
        <Callout variant="blue">
          <strong>Where the check sits.</strong>{" "}
          The second factor is verified after the password (or licence key) proves out and
          before any account state is read. A caller who cannot complete it learns nothing
          about the account — not whether it has a subscription, when it expires, or which
          HWID it is bound to.
        </Callout>
      </DocSection>

      <Divider />

      <DocSection id="setup2fa">
        <DocH2>Setup2FA</DocH2>
        <Sig>Result Setup2FA(const std::string&amp; password = &quot;&quot;)</Sig>
        <DocP>
          Begins enrolment. Returns a <Code>secret</Code> and an <Code>otpauth_uri</Code>:
          render the URI as a QR code, and show the secret as text for users who cannot
          scan. Pass the account password when the account has one — changing what it takes
          to get a session should not ride on a session alone. Accounts that authenticate by
          licence key have no password, so for those the argument is ignored.
        </DocP>
        <DocP>
          Enrolment is <strong>not live</strong> until <Code>Confirm2FA()</Code> succeeds.
          The secret is held server-side for fifteen minutes and is never retrievable again.
        </DocP>
        <CodeBlock>{`auto setup = client.Setup2FA(password);
if (setup.ok()) {
    // otpauth_uri -> QR, secret -> manual entry fallback
    ShowEnrolmentScreen(setup.json);
}`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="confirm2fa">
        <DocH2>Confirm2FA</DocH2>
        <Sig>Result Confirm2FA(const std::string&amp; totp_code)</Sig>
        <DocP>
          Commits the enrolment, but only once a code proves the authenticator actually
          works. That ordering is the point: committing first would let a mistyped or
          mis-scanned secret lock a paying customer out of their own account.
        </DocP>
        <Callout variant="amber">
          <strong>Backup codes are shown once.</strong>{" "}
          The response carries ten single-use backup codes. They are stored hashed and
          cannot be shown again. Display them, and tell the user to keep them somewhere
          other than the device running your app.
        </Callout>
        <CodeBlock>{`auto done = client.Confirm2FA(userTypedCode);
if (done.ok()) {
    ShowBackupCodesOnce(done.json);   // backup_codes[]
}`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="disable2fa">
        <DocH2>Disable2FA</DocH2>
        <Sig>Result Disable2FA(const std::string&amp; totp_code)</Sig>
        <DocP>
          Turns the second factor off. A currently-valid code (or an unused backup code) is
          required — a session alone is not enough, because a stolen session is precisely
          what the second factor exists to stop. Refused outright when the app policy is
          <Code>required</Code>.
        </DocP>
      </DocSection>

      <Divider />

      <DocSection id="get2fastatus">
        <DocH2>Get2FAStatus</DocH2>
        <Sig>Result Get2FAStatus()</Sig>
        <DocP>
          Reports <Code>enabled</Code>, <Code>enrolled_at</Code>,{" "}
          <Code>backup_codes_remaining</Code>, <Code>locked</Code> and the app&apos;s{" "}
          <Code>policy</Code>, so you can render the right toggle. Never returns the secret
          or the backup codes.
        </DocP>
      </DocSection>

      <Divider />

      <DocSection id="twofa-errors">
        <DocH2>Two-factor error codes</DocH2>
        <DocTable
          headers={["Code", "Meaning", "What to do"]}
          rows={[
            ["TWOFA_REQUIRED", "Credential was correct; a code is needed.", "Prompt, then retry Login/License with the code."],
            ["TWOFA_INVALID", "Code rejected.", "Let the user retry. The budget is finite — see below."],
            ["TWOFA_LOCKED", "Too many wrong codes on this account.", "Show retry_after_ms and stop submitting."],
            ["TWOFA_ENROLMENT_REQUIRED", "App policy is required; account has no second factor.", "Route into Setup2FA."],
            ["TWOFA_NO_ENROLMENT", "Confirm2FA called with no setup in progress, or it expired.", "Start again from Setup2FA."],
            ["REAUTH_REQUIRED", "Password needed for this operation.", "Prompt for the password and repeat the call."],
          ]}
        />
        <Callout variant="blue">
          <strong>Why a wrong code and a reused code look identical.</strong>{" "}
          A correct-but-already-used code returns <Code>TWOFA_INVALID</Code>, not a distinct
          &quot;already used&quot;. Telling a caller their code was right but spent would
          confirm they hold a valid secret, which is exactly what a replaying attacker wants
          to learn. Each code is single-use: accepting one records its time-step, and that
          step and every earlier one are refused afterwards.
        </Callout>
        <DocP>
          Wrong codes are counted <strong>per account</strong>, not per IP — an attacker with
          a proxy pool would otherwise have an unbounded budget. Five failures lock the
          account&apos;s second factor for fifteen minutes.
        </DocP>
      </DocSection>

      <Divider />

      <DocSection id="logout">
        <DocH2>Logout</DocH2>
        <Sig>Result Logout(bool everywhere = false)</Sig>
        <DocP>
          Ends the current session. With <Code>everywhere = true</Code>, ends every session
          the user holds on this application — the control to offer when someone suspects
          their account is compromised, or is handing back a shared machine.
        </DocP>
        <CodeBlock>{`client.Logout();          // this device
client.Logout(true);      // every device`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="changeusername">
        <DocH2>ChangeUsername</DocH2>
        <Sig>Result ChangeUsername(const std::string&amp; new_username, const std::string&amp; password = &quot;&quot;)</Sig>
        <DocP>
          Renames the account. Usernames are unique per developer and stored lowercased.
          The password is required when the account has one.
        </DocP>
        <DocP>
          A thirty-day cooldown applies. That is not cosmetic: without one, rename is an
          impersonation primitive — release a recognisable name for someone else to take, or
          cycle names to outrun moderation. Previous names are retained so support and abuse
          work can still resolve them.
        </DocP>
        <DocTable
          headers={["Code", "Meaning"]}
          rows={[
            ["USERNAME_TAKEN", "Already in use on your account, or reserved."],
            ["USERNAME_INVALID", "Fails the username rules for this app."],
            ["USERNAME_COOLDOWN", "Changed too recently. next_allowed_at says when."],
            ["USERNAME_UNCHANGED", "Same as the current name."],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="password-recovery">
        <DocH2>Password recovery</DocH2>
        <Sig>Result RequestPasswordReset(const std::string&amp; username_or_email)</Sig>
        <Sig>Result ResetPassword(const std::string&amp; token, const std::string&amp; new_password)</Sig>
        <DocP>
          Recovery is deliberately a two-party flow: <strong>Evora issues and verifies the
          token, you deliver it.</strong>
        </DocP>
        <Callout variant="blue">
          <strong>Evora does not email your users.</strong>{" "}
          They are your customers, not ours. Sending &quot;your password reset&quot; from an
          Evora domain about your product is wrong branding, and pooling every tenant&apos;s
          transactional mail onto one sender reputation is a deliverability and abuse
          liability. In practice almost no end-user accounts carry an email address anyway,
          so an email-keyed reset would serve nobody.
        </Callout>
        <DocUl
          items={[
            <>
              <Code>RequestPasswordReset()</Code> raises the request to you — a dashboard
              notification plus an app log entry — and returns success whether or not the
              account exists. It never returns a token. The uniform response is what stops
              this being a free account-enumeration endpoint against your whole user base.
            </>,
            <>
              You issue a token with <Code>POST /users/:userId/password-reset</Code> and
              deliver it over whatever channel your customers actually use — commonly a
              Discord DM.
            </>,
            <>
              <Code>ResetPassword()</Code> lets the customer redeem that token{" "}
              <strong>inside your app</strong>, so recovery never needs a web page. Every
              live session for the account is ended as the password changes.
            </>,
          ]}
        />
        <CodeBlock>{`// 1. in-app: user asks for help
client.RequestPasswordReset("username");
// -> always reports success; you receive a dashboard notification

// 2. you issue a token from the dashboard or developer API,
//    and send it to them yourself

// 3. in-app: they paste it
auto r = client.ResetPassword(token, newPassword);`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="fetchstats">
        <DocH2>FetchStats</DocH2>
        <Sig>Result FetchStats()</Sig>
        <DocP>
          Returns <Code>users</Code>, <Code>licenses</Code>, <Code>online</Code> and{" "}
          <Code>version</Code> for the application — the numbers behind a &quot;1,204 users
          online&quot; banner.
        </DocP>
        <Callout variant="amber">
          <strong>Off by default.</strong>{" "}
          Enable it per app under <Code>Settings → Access policies → Publish app
          statistics</Code>. User and licence totals are commercial information and every
          client binary is in someone else&apos;s hands, so this is a disclosure you choose
          rather than inherit. Until you switch it on the call returns{" "}
          <Code>STATS_DISABLED</Code>.
        </Callout>
      </DocSection>

      <Divider />

      <DocSection id="twofa-support">
        <DocH2>When a user loses their authenticator</DocH2>
        <DocP>
          Backup codes cover the ordinary case. When someone loses both their authenticator
          and their codes, reset them from{" "}
          <Code>Users → ⋯ → Reset two-factor</Code>, or{" "}
          <Code>DELETE /users/:userId/2fa</Code> on the developer API.
        </DocP>
        <DocP>
          This is the only path that removes a second factor without presenting a code,
          which is why it requires your authenticated developer credentials and is never
          reachable from the SDK — a self-service &quot;just turn it off&quot; would defeat
          the feature entirely. The account&apos;s live sessions are ended with the reset,
          on the assumption that the reason for it may have been a compromise.
        </DocP>
      </DocSection>
    </>
  );
}

export { AccountSections };
