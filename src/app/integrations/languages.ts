export type LanguagePage = {
  slug: string;
  name: string;
  aka: string[];
  blurb: string;
  runtime: string;
  sample: string;
  lang: string;
};

const BASE = "https://api.evora.lol/api/developer-api";

export const LANGUAGES: LanguagePage[] = [
  {
    slug: "php",
    name: "PHP",
    aka: ["php licensing api", "php license key system", "laravel license validation"],
    blurb:
      "Validate a licence from PHP with cURL. Runs anywhere PHP does — shared hosting, Laravel, a plain script behind your storefront.",
    runtime: "PHP 7.4+ with ext-curl. No dependencies.",
    lang: "php",
    sample: `<?php
$appId = 'YOUR_APP_ID';
$ch = curl_init("${BASE}/apps/$appId/licenses/authenticate");

curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . getenv('EVORA_API_KEY'),
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode(['licenseKey' => $_POST['license']]),
]);

$result = json_decode(curl_exec($ch), true);
curl_close($ch);

if (!empty($result['authenticated'])) {
    // issue YOUR session here — never hand the API key to the browser
    $_SESSION['plan'] = $result['subscription']['level'] ?? 0;
}`,
  },
  {
    slug: "nodejs",
    name: "Node.js",
    aka: ["nodejs license key api", "express license validation", "javascript licensing server"],
    blurb:
      "Validate a licence from a Node backend with the built-in fetch. Express, Fastify, Next route handlers — anywhere that runs server-side.",
    runtime: "Node 18+ (global fetch). No dependencies.",
    lang: "javascript",
    sample: `const APP_ID = process.env.EVORA_APP_ID;

export async function verifyLicence(licenseKey) {
  const res = await fetch(
    \`${BASE}/apps/\${APP_ID}/licenses/authenticate\`,
    {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${process.env.EVORA_API_KEY}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ licenseKey }),
    },
  );

  if (!res.ok) return { ok: false, status: res.status };
  const data = await res.json();
  return { ok: data.authenticated === true, subscription: data.subscription };
}

// Call this from your server only. A key in client-side JS is a public key.`,
  },
  {
    slug: "python",
    name: "Python",
    aka: ["python license key api", "django license validation", "flask licensing"],
    blurb:
      "Validate a licence from Python with requests. Django, Flask, FastAPI, or a bare script driving your delivery pipeline.",
    runtime: "Python 3.8+ with requests.",
    lang: "python",
    sample: `import os
import requests

BASE = "${BASE}"
APP_ID = os.environ["EVORA_APP_ID"]

def verify_licence(license_key: str) -> dict:
    r = requests.post(
        f"{BASE}/apps/{APP_ID}/licenses/authenticate",
        headers={
            "Authorization": f"Bearer {os.environ['EVORA_API_KEY']}",
            "Content-Type": "application/json",
        },
        json={"licenseKey": license_key},
        timeout=10,
    )
    r.raise_for_status()
    data = r.json()
    return {
        "ok": data.get("authenticated") is True,
        "subscription": data.get("subscription"),
    }`,
  },
  {
    slug: "csharp",
    name: "C#",
    aka: ["c# license key api", "dotnet licensing", "asp.net license validation"],
    blurb:
      "Validate a licence from .NET with HttpClient. ASP.NET Core, a worker service, or a desktop app talking to your own backend.",
    runtime: ".NET 6+. No packages beyond the BCL.",
    lang: "csharp",
    sample: `using System.Net.Http.Json;

var http = new HttpClient { BaseAddress = new Uri("${BASE}/") };
http.DefaultRequestHeaders.Authorization =
    new("Bearer", Environment.GetEnvironmentVariable("EVORA_API_KEY"));

var appId = Environment.GetEnvironmentVariable("EVORA_APP_ID");

var res = await http.PostAsJsonAsync(
    $"apps/{appId}/licenses/authenticate",
    new { licenseKey });

res.EnsureSuccessStatusCode();
var data = await res.Content.ReadFromJsonAsync<AuthResult>();

record AuthResult(bool Authenticated, Subscription? Subscription);
record Subscription(int Level, string? Name, DateTime? ExpiresAt, bool Active);`,
  },
  {
    slug: "go",
    name: "Go",
    aka: ["go license key api", "golang licensing", "go software licensing"],
    blurb:
      "Validate a licence from Go with net/http. Fits a service, a CLI, or the backend behind your storefront.",
    runtime: "Go 1.21+. Standard library only.",
    lang: "go",
    sample: `package licence

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

type Result struct {
	Authenticated bool \`json:"authenticated"\`
	Subscription  *struct {
		Level  int    \`json:"level"\`
		Name   string \`json:"name"\`
		Active bool   \`json:"active"\`
	} \`json:"subscription"\`
}

func Verify(key string) (*Result, error) {
	body, _ := json.Marshal(map[string]string{"licenseKey": key})
	url := fmt.Sprintf("${BASE}/apps/%s/licenses/authenticate", os.Getenv("EVORA_APP_ID"))

	req, _ := http.NewRequest("POST", url, bytes.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+os.Getenv("EVORA_API_KEY"))
	req.Header.Set("Content-Type", "application/json")

	res, err := (&http.Client{Timeout: 10 * time.Second}).Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	var out Result
	return &out, json.NewDecoder(res.Body).Decode(&out)
}`,
  },
  {
    slug: "java",
    name: "Java",
    aka: ["java license key api", "spring boot licensing", "java software licensing"],
    blurb:
      "Validate a licence from Java with the built-in HttpClient. Spring Boot, Quarkus, or a plain JAR on your server.",
    runtime: "Java 11+. No dependencies.",
    lang: "java",
    sample: `import java.net.URI;
import java.net.http.*;

var appId = System.getenv("EVORA_APP_ID");
var body = """
    {"licenseKey": "%s"}
    """.formatted(licenseKey);

var request = HttpRequest.newBuilder()
    .uri(URI.create("${BASE}/apps/" + appId + "/licenses/authenticate"))
    .header("Authorization", "Bearer " + System.getenv("EVORA_API_KEY"))
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();

var response = HttpClient.newHttpClient()
    .send(request, HttpResponse.BodyHandlers.ofString());

// response.body() is JSON: { "authenticated": true, "subscription": { ... } }`,
  },
  {
    slug: "ruby",
    name: "Ruby",
    aka: ["ruby license key api", "rails license validation", "ruby licensing"],
    blurb:
      "Validate a licence from Ruby with net/http. Rails, Sinatra, or a rake task in your release pipeline.",
    runtime: "Ruby 3.0+. Standard library only.",
    lang: "ruby",
    sample: `require "net/http"
require "json"

APP_ID = ENV.fetch("EVORA_APP_ID")

def verify_licence(license_key)
  uri = URI("${BASE}/apps/#{APP_ID}/licenses/authenticate")

  req = Net::HTTP::Post.new(uri)
  req["Authorization"] = "Bearer #{ENV.fetch('EVORA_API_KEY')}"
  req["Content-Type"]  = "application/json"
  req.body = { licenseKey: license_key }.to_json

  res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |h| h.request(req) }
  data = JSON.parse(res.body)

  { ok: data["authenticated"] == true, subscription: data["subscription"] }
end`,
  },
];

export function languageBySlug(slug: string): LanguagePage | undefined {
  return LANGUAGES.find((l) => l.slug === slug);
}
