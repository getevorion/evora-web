import {
  DocSection, DocH2, DocH3, DocP,
  Sig, Code, CodeBlock, Callout, Badge, ProBadge,
  DocTable, DocUl, Divider,
} from "../components";

function AuthSections() {
  return (
    <>
      <DocSection id="login">
        <DocH2>Login</DocH2>
        <Sig>Result Login(const std::string&amp; username, const std::string&amp; password, const std::string&amp; totp_code = "")</Sig>
        <DocP>
          Authenticates with username and password. Populates <Code>User()</Code> on success.
          Blocked when auth mode is <Code>"license"</Code>.
        </DocP>
        <DocP>
          Leave <Code>totp_code</Code> empty on the first attempt. If the account has
          two-factor enabled, or the app&apos;s policy requires it, the call fails with
          code <Code>TWOFA_REQUIRED</Code> — prompt for the six-digit code and call again
          with it filled in. The server only reports this <em>after</em> the password
          verifies, so a wrong password never reveals whether the account exists.
        </DocP>
        <CodeBlock>{`auto r = client.Login("user", "pass");
if (!r.ok()) {
    std::cerr << r.message() << "\\n";
    if (r.error_code == evorion::ErrorCode::InvalidCredentials)
        std::cerr << "wrong username or password\\n";
}`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="register">
        <DocH2>Register</DocH2>
        <Sig>Result Register(const std::string&amp; username, const std::string&amp; password)</Sig>
        <DocP>
          Creates a new user account. Does <strong>not</strong> auto-login, so call{" "}
          <Code>Login()</Code> afterwards. Blocked when auth mode is <Code>"license"</Code>.
        </DocP>
        <CodeBlock>{`auto r = client.Register("newuser", "securepass");
if (r.ok()) {
    // now login with the new account
    auto login = client.Login("newuser", "securepass");
}`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="license">
        <DocH2>License Key</DocH2>
        <Sig>Result License(const std::string&amp; license_key, const std::string&amp; totp_code = "")</Sig>
        <DocP>
          Validates and activates a license key. Populates <Code>User()</Code> on success.
          Blocked when auth mode is <Code>"user_pass"</Code>.
        </DocP>
        <DocP>
          Key-only auth runs the same second-factor check as <Code>Login()</Code>. A license
          key is a bearer credential — anyone holding the string can use it — so it is the
          case where a second factor earns its keep. Handle <Code>TWOFA_REQUIRED</Code> the
          same way.
        </DocP>
        <CodeBlock>{`auto r = client.License("XXXXX-XXXXX-XXXXX");
if (!r.ok()) {
    if (r.error_code == evorion::ErrorCode::InvalidLicense)
        std::cerr << "key not found or already used\\n";
}`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="client">
        <DocH2>Client</DocH2>
        <DocP>The main SDK class. Non-copyable, non-assignable. Two constructor variants:</DocP>

        <DocH3>Plaintext constructor</DocH3>
        <CodeBlock>{`evorion::Client(
    const std::string& owner_id,
    const std::string& app_id,
    const std::string& version,
    TransportMode mode          = TransportMode::Http,
    bool          auto_init     = true,
    int           heartbeat_interval = 30,
    int           antidebug_interval = 500,
    bool          auto_exit     = true
);`}</CodeBlock>

        <DocH3>Secure constructor</DocH3>
        <DocP>
          Uses <Code>SecureCredential</Code> for a compile-time-encrypted owner id. Recommended
          for production builds.
        </DocP>
        <CodeBlock>{`evorion::Client(
    const SecureCredential& owner_id,
    const std::string&      app_id,
    const std::string&      version,
    TransportMode mode          = TransportMode::Http,
    bool          auto_init     = true,
    int           heartbeat_interval = 30,
    int           antidebug_interval = 500,
    bool          auto_exit     = true
);`}</CodeBlock>

        <DocH3>Parameters</DocH3>
        <DocTable
          headers={["Parameter", "Description"]}
          rows={[
            ["owner_id", "Your owner UUID from the dashboard"],
            ["app_id", "Application UUID"],
            ["version", "Your app version string (for version gating)"],
            ["mode", "Http or WebSocket. WebSocket enables server push."],
            ["auto_init", "Calls Init() automatically in the constructor"],
            ["heartbeat_interval", "Heartbeat interval in seconds. Set 0 to disable."],
            ["antidebug_interval", "Anti-debug scan interval in milliseconds. Set 0 to disable."],
            ["auto_exit", "Terminate process on tamper detection"],
          ]}
        />

        <DocH3>Utility methods</DocH3>
        <DocTable
          headers={["Method", "Returns", "Description"]}
          rows={[
            ["Initialized()", "bool", "Whether Init() succeeded"],
            ["Authenticated()", "bool", "Whether user is logged in"],
            ["LastError()", "const string&", "Last error message"],
            ["LastErrorCode()", "ErrorCode", "Last typed error code"],
            ["User()", "const UserData&", "Current user data (after auth)"],
            ["IsBlacklisted()", "bool", "Whether this HWID is banned"],
            ["GetAppName()", "string", "App name from server config"],
            ["GetAuthMode()", "string", '"license", "user_pass", or "both"'],
            ["GetSdkVersion()", "string", 'SDK version (e.g. "2.9.7")'],
            ["IsWebSocketConnected()", "bool", "WS transport connection status"],
            ["Wait()", "void", "Block forever (heartbeat stays alive)"],
            ["Close()", "void", "Tears down the client, stops all timers and closes transports"],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="result">
        <DocH2>Result</DocH2>
        <DocP>Returned by every API call. Check <Code>ok()</Code> first, then read details.</DocP>
        <DocTable
          headers={["Field / Method", "Type", "Description"]}
          rows={[
            ["ok()", "bool", "Operation succeeded"],
            ["message()", "string", "Human-readable status or error"],
            ["error_code", "ErrorCode", "Typed enum for programmatic handling"],
            ["error", "string", "Raw error string"],
            ["json", "string", "Raw JSON response body"],
            ["blacklisted", "bool", "Device/user is on the blacklist"],
            ["FileContents()", "vector<uint8_t>", "Binary file data (only after DownloadFile())"],
            ["FileName()", "string", "Original filename (only after DownloadFile())"],
          ]}
        />
        <CodeBlock label="error handling pattern">{`auto r = client.Login("user", "pass");
if (!r.ok()) {
    std::cerr << "Error: " << r.message() << "\\n";
    std::cerr << "Code:  " << (int)r.error_code << "\\n";

    if (r.blacklisted)
        std::cerr << "device is banned\\n";
}`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="userdata">
        <DocH2>UserData</DocH2>
        <DocP>
          Populated after successful <Code>Login()</Code> or <Code>License()</Code>. Access via{" "}
          <Code>client.User()</Code>.
        </DocP>
        <DocH3>Fields</DocH3>
        <DocTable
          headers={["Field", "Type", "Description"]}
          rows={[
            ["username", "string", "Account username"],
            ["hwid", "string", "Hardware ID bound to this account"],
            ["ip", "string", "IP address (server-reported)"],
            ["subscription", "string", "Subscription plan name"],
            ["subscription_level", "int", "Numeric tier level"],
            ["expiry", "string", "Expiry date/time, ISO-8601 (e.g. 2026-09-25T19:41:57.736Z)"],
            ["expiry_unix", "int64_t", "The same instant as a Unix timestamp. Prefer this over parsing expiry"],
            ["create_date", "int64_t", "Account creation (Unix timestamp)"],
            ["last_login", "int64_t", "Last login (Unix timestamp)"],
            ["variables", "map<string,string>", "Server-defined per-user key-value data"],
          ]}
        />
        <DocP>
          If you render the expiry yourself, read <code>expiry_unix</code> rather than parsing the{" "}
          <code>expiry</code> string. A hand-written ISO parser that forgets <code>struct tm</code> counts
          months from zero shows every expiry exactly one month late, with the day and time of day intact,
          so a one day key reads as a month and a three hour key bought on the 19th reads as the 19th of
          next month. <code>GetTimeLeftSeconds()</code> and <code>FormatTimeLeft()</code> already handle
          this for you, and the raw response also carries <code>seconds_remaining</code> computed by the
          server.
        </DocP>
        <DocH3>Helper methods</DocH3>
        <DocTable
          headers={["Method", "Returns", "Description"]}
          rows={[
            ["HasSubscription()", "bool", "Has any active subscription"],
            ["IsLifetime()", "bool", "Subscription never expires"],
            ["GetTimeLeftSeconds()", "int64_t", "Seconds until expiry"],
            ["FormatTimeLeft()", "string", "Formatted time remaining"],
            ["GetVariable(key, default)", "string", "Lookup a user variable"],
            ["IsValid()", "bool", "Whether UserData has been populated"],
          ]}
        />
        <CodeBlock>{`auto& user = client.User();
std::cout << "User: " << user.username << "\\n";
std::cout << "Plan: " << user.subscription << "\\n";
std::cout << "Time: " << user.FormatTimeLeft() << "\\n";

// read a custom variable set in the dashboard
std::string tier = user.GetVariable("tier", "free");`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="errors">
        <DocH2>Error Codes</DocH2>
        <DocP><Code>evorion::ErrorCode</Code> enum for programmatic error handling:</DocP>
        <DocTable
          headers={["Code", "Value", "Meaning"]}
          rows={[
            ["None", "0", "No error"],
            ["Unknown", "1", "Unclassified"],
            ["InvalidCredentials", "2", "Wrong username/password"],
            ["InvalidLicense", "3", "License key not found or already used"],
            ["HwidMismatch", "4", "Hardware doesn't match registered device"],
            ["UserBanned", "5", "Account is banned"],
            ["SubscriptionExpired", "6", "Subscription ran out"],
            ["NoSubscription", "7", "No active subscription"],
            ["DeviceMismatch", "8", "Device fingerprint mismatch"],
            ["SessionExpired", "9", "Session token expired"],
            ["IntegrityViolation", "10", "Binary tamper detected"],
            ["VersionBlocked", "11", "App version is blocked"],
            ["AuthModeRestricted", "12", "Auth mode doesn't allow this method"],
            ["ServerError", "13", "Server-side error"],
          ]}
        />
      </DocSection>

      <Divider />

      <DocSection id="init">
        <DocH2>Init</DocH2>
        <Sig>Result Init()</Sig>
        <DocP>
          Establishes a session with the server: device registration, session tokens, and app
          config. Only needed when <Code>auto_init</Code> is <Code>false</Code>.
        </DocP>
        <CodeBlock label="manual init">{`evorion::Client client(owner, app, ver,
    evorion::TransportMode::Http,
    false  // auto_init off
);

auto r = client.Init();
if (!r.ok()) {
    std::cerr << "init failed: " << r.message() << "\\n";
    return 1;
}`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="check">
        <DocH2>Check</DocH2>
        <Sig>Result Check()</Sig>
        <DocP>
          Validates the current session is still live on the server. Useful for manual session
          verification outside the automatic heartbeat cycle.
        </DocP>
        <CodeBlock>{`auto r = client.Check();
if (!r.ok()) {
    // session died, re-authenticate
}`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="heartbeat">
        <DocH2>Heartbeat</DocH2>
        <Sig>Result Heartbeat()</Sig>
        <DocP>
          Keeps the session alive. Runs automatically in a background thread (controlled by{" "}
          <Code>heartbeat_sec</Code>), but you can call it manually if needed.
        </DocP>
      </DocSection>

      <Divider />

      <DocSection id="getvar">
        <DocH2>GetVar</DocH2>
        <Sig>Result GetVar(const std::string&amp; var_name)</Sig>
        <DocP>
          Fetches a server-side variable by name. Value is returned in <Code>Result::json</Code>.
        </DocP>
        <CodeBlock>{`auto r = client.GetVar("motd");
if (r.ok())
    std::cout << "Message: " << r.json << "\\n";`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="setuservar">
        <DocH2>
          SetUserVar <Badge>New</Badge>
        </DocH2>
        <Sig>Result SetUserVar(const std::string&amp; key, const std::string&amp; value)</Sig>
        <DocP>
          Sets a per-user variable on the server. Each user has their own isolated key-value store
          scoped to your application. If the key already exists it will be overwritten, unless the
          variable was marked <strong>read-only</strong> by the developer in the dashboard, in
          which case the call fails gracefully. Keys can be up to 100 characters, values up to
          10,000 characters.
        </DocP>
        <Callout variant="blue">
          Variables set from the SDK are <strong>read-write by default</strong>. Developers can
          lock specific variables to read-only from the dashboard.
        </Callout>
        <CodeBlock>{`// save a play count
auto r = client.SetUserVar("play_count", "42");
if (!r.ok())
    std::cerr << "set failed: " << r.message() << "\\n";

// save a JSON config (values are strings)
client.SetUserVar("settings", R"({"fov":90,"sens":2.5})");`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="getuservar">
        <DocH2>
          GetUserVar <Badge>New</Badge>
        </DocH2>
        <Sig>Result GetUserVar(const std::string&amp; key = "")</Sig>
        <DocP>
          Retrieves per-user variables. Pass a key to get a single variable, or call with no
          arguments to retrieve <strong>all</strong> variables for the current user as a JSON
          object.
        </DocP>
        <CodeBlock label="single variable">{`auto r = client.GetUserVar("play_count");
if (r.ok())
    std::cout << "plays: " << r.json << "\\n";`}</CodeBlock>
        <CodeBlock label="all variables">{`// empty key = get everything
auto all = client.GetUserVar();
if (all.ok())
    std::cout << "all vars: " << all.json << "\\n";
// output: {"play_count":"42","settings":"{\\"fov\\":90}"}`}</CodeBlock>
        <Callout variant="blue">
          <strong>GetVar vs GetUserVar.</strong> <Code>GetVar()</Code> fetches{" "}
          <em>application-wide</em> variables (same value for all users).{" "}
          <Code>GetUserVar()</Code> fetches <em>per-user</em> variables (unique to each
          authenticated user).
        </Callout>
      </DocSection>

      <Divider />

      <DocSection id="fetchonline">
        <DocH2>
          FetchOnline <Badge>New</Badge>
        </DocH2>
        <Sig>Result FetchOnline()</Sig>
        <DocP>
          Returns the number of currently online users in your application. A user is considered
          online if they have an active session with a heartbeat within the last 5 minutes. The
          count is returned in <Code>Result::json</Code> as the <Code>online</Code> field.
        </DocP>
        <CodeBlock>{`auto r = client.FetchOnline();
if (r.ok())
    std::cout << "Users online: " << r.json << "\\n";
// output: {"success":true,"online":17}`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="ban">
        <DocH2>
          Ban <Badge>New</Badge>
        </DocH2>
        <Sig>Result Ban(const std::string&amp; reason = "")</Sig>
        <DocP>
          Permanently bans the currently authenticated user. The server kills the active session
          immediately after. This is <strong>irreversible</strong> from the SDK. Only a developer
          can unban the user from the dashboard. Useful as a client-side anti-tamper response.
        </DocP>
        <Callout variant="amber">
          <strong>Caution.</strong> This permanently bans the user&apos;s account. The session is
          terminated server-side and the ban reason is logged.
        </Callout>
        <CodeBlock>{`// detected something suspicious, ban and exit
client.Ban("Tamper detected by client");
std::exit(1);`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="invokewebhook">
        <DocH2>
          InvokeWebhook <Badge>New</Badge>
          <ProBadge />
        </DocH2>
        <Sig>
          Result InvokeWebhook(const std::string&amp; webhook_id, const std::string&amp;
          data_json = "")
        </Sig>
        <DocP>
          Triggers a server-side webhook from the SDK. The webhook must be marked as{" "}
          <strong>SDK Callable</strong> in the developer dashboard. The webhook URL is never
          exposed to the client. Pass an optional JSON object as <Code>data_json</Code> to include
          custom data in the webhook payload. The server will POST to the configured URL with event
          details including user ID, IP, timestamp, and custom data.
        </DocP>
        <Callout variant="blue">
          <strong>Dashboard setup required.</strong> Go to your app&apos;s Webhooks page, create
          a webhook, and enable the <em>SDK Callable</em> toggle. If <em>Authenticated Only</em>{" "}
          is on (default), only logged-in users can invoke it.
        </Callout>
        <CodeBlock label="fire with custom data">{`auto r = client.InvokeWebhook(
    "wh-uuid-from-dashboard",
    R"({"event":"level_complete","score":9500})"
);
if (!r.ok())
    std::cerr << "webhook failed: " << r.message() << "\\n";`}</CodeBlock>
        <CodeBlock label="simple ping">{`client.InvokeWebhook("wh-uuid-from-dashboard");`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="downloadfile">
        <DocH2>
          DownloadFile <Badge>New in v2.9.7</Badge>
        </DocH2>
        <Sig>Result DownloadFile(const std::string&amp; file_id)</Sig>
        <DocP>
          Downloads a file from the server by its file ID. The file must be uploaded through the
          dashboard under your application. On success, use <Code>Result::FileContents()</Code>{" "}
          for the raw binary data and <Code>Result::FileName()</Code> for the original filename.
        </DocP>
        <Callout variant="blue">
          Files are delivered end-to-end encrypted. The server never sees plaintext file contents.
          Decryption happens client-side in the SDK.
        </Callout>
        <CodeBlock label="download & save to disk">{`auto r = client.DownloadFile("YOUR_FILE_ID");
if (!r.ok()) {
    std::cerr << "download failed: " << r.message() << "\\n";
    return 1;
}

std::vector<uint8_t> data = r.FileContents();
std::string name = r.FileName();

std::ofstream out(name, std::ios::binary);
out.write(reinterpret_cast<const char*>(data.data()), data.size());`}</CodeBlock>
        <CodeBlock label="load into memory">{`auto r = client.DownloadFile("config-file-id");
if (r.ok()) {
    auto bytes = r.FileContents();
    std::string text(bytes.begin(), bytes.end());
    std::cout << "loaded " << bytes.size() << " bytes\\n";
}`}</CodeBlock>
      </DocSection>

      <Divider />

      <DocSection id="onpush">
        <DocH2>OnPush</DocH2>
        <Sig>
          void OnPush(std::function&lt;void(const std::string&amp; type, const std::string&amp;
          payload)&gt; cb)
        </Sig>
        <DocP>
          Registers a callback for server-pushed messages. Only works in{" "}
          <Code>WebSocket</Code> transport mode. Common push types include <Code>"kill"</Code> and{" "}
          <Code>"ban"</Code>.
        </DocP>
        <CodeBlock>{`client.OnPush([](const std::string& type, const std::string& payload) {
    if (type == "kill" || type == "ban") {
        std::cerr << "Terminated by server: " << payload << "\\n";
        ExitProcess(0);
    }
});`}</CodeBlock>
      </DocSection>
    </>
  );
}

export { AuthSections };
