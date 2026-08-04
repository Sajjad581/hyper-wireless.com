import type { DocPage } from "./types";

export const cicdPages: DocPage[] = [
  {
    slug: "github-actions",
    title: "GitHub Actions for 3GPP conformance",
    description:
      "Run TTCN-3 conformance campaigns from GitHub Actions: workflow file, secrets, PR gating, JUnit annotations, and artifact upload.",
    group: "CI/CD",
    keywords: ["github actions 3gpp", "ci conformance testing", "ttcn-3 ci"],
    readMinutes: 6,
    blocks: [
      {
        paragraphs: [
          "Because the tester is a service, conformance testing becomes a normal CI step. No self-hosted runner in a lab, no hardware reservation spreadsheet.",
        ],
      },
      {
        heading: "Workflow",
        code: {
          lang: "yaml",
          label: ".github/workflows/conformance.yaml",
          body: `name: conformance
on: [pull_request]

jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install AEON CLI
        run: curl -fsSL https://get.aeon.cloud | AEON_VERSION=1.12.3 bash

      - name: Push build
        env: { AEON_TOKEN: "${"$"}{{ secrets.AEON_TOKEN }}" }
        run: |
          make ue-bundle
          aeon builds push ./dist/ue.tar.gz --tag "$GITHUB_SHA" --commit "$GITHUB_SHA"

      - name: Run smoke campaign
        env: { AEON_TOKEN: "${"$"}{{ secrets.AEON_TOKEN }}" }
        run: aeon exec run --campaign smoke --build "$GITHUB_SHA" --wait --exit-code --quiet

      - name: Export JUnit
        if: always()
        env: { AEON_TOKEN: "${"$"}{{ secrets.AEON_TOKEN }}" }
        run: aeon reports get --build "$GITHUB_SHA" --format junit --output junit.xml

      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: conformance-evidence, path: junit.xml }`,
        },
      },
      {
        heading: "Gate policy",
        bullets: [
          "Pull requests: smoke campaign, under 20 minutes, blocking.",
          "Merge to main: regression campaign, non-blocking notification.",
          "Nightly schedule: full applicable set with 8-12 lanes.",
          "Release tags: certification campaign producing a signed PDF.",
        ],
        note: "Use --exit-code so a fail verdict fails the job. Without it the step succeeds regardless of verdict.",
      },
    ],
  },
  {
    slug: "gitlab-ci",
    title: "GitLab CI integration",
    description:
      "Wire AEON conformance campaigns into .gitlab-ci.yml with masked variables, JUnit reports in merge requests, and scheduled nightly pipelines.",
    group: "CI/CD",
    keywords: ["gitlab ci telecom", "gitlab junit report", "conformance pipeline"],
    readMinutes: 5,
    blocks: [
      {
        code: {
          lang: "yaml",
          label: ".gitlab-ci.yml",
          body: `stages: [build, conformance]

variables:
  AEON_VERSION: "1.12.3"

.aeon: &aeon
  image: ghcr.io/aeon-cloud/cli:1.12.3
  before_script: [ "aeon whoami" ]

conformance:smoke:
  <<: *aeon
  stage: conformance
  script:
    - aeon builds push ./dist/ue.tar.gz --tag "$CI_COMMIT_SHA"
    - aeon exec run --campaign smoke --build "$CI_COMMIT_SHA" --wait --exit-code --quiet
    - aeon reports get --build "$CI_COMMIT_SHA" --format junit --output junit.xml
  artifacts:
    when: always
    reports:
      junit: junit.xml

conformance:nightly:
  <<: *aeon
  stage: conformance
  rules: [ { if: '$CI_PIPELINE_SOURCE == "schedule"' } ]
  script:
    - aeon exec run --campaign nightly --build main --lanes 8 --wait --quiet`,
        },
        note: "Store AEON_TOKEN as a masked, protected CI/CD variable. Never echo it in a script step.",
      },
    ],
  },
  {
    slug: "jenkins-ttcn3",
    title: "Jenkins CI for TTCN-3 conformance testing",
    description:
      "Declarative Jenkins pipeline for 3GPP TTCN-3 campaigns: credentials binding, parallel lane stages, JUnit publishing, and archived evidence.",
    group: "CI/CD",
    keywords: ["ttcn-3 jenkins", "jenkins 3gpp conformance", "jenkins telecom pipeline"],
    readMinutes: 7,
    blocks: [
      {
        paragraphs: [
          "Jenkins remains the default in telecom engineering organisations, and it maps cleanly onto AEON: the pipeline never touches hardware, so agents stay stateless and disposable.",
        ],
      },
      {
        heading: "Declarative pipeline",
        code: {
          lang: "groovy",
          label: "Jenkinsfile",
          body: `pipeline {
  agent { docker { image 'ghcr.io/aeon-cloud/cli:1.12.3' } }
  environment { AEON_PROJECT = 'nr-modem-x75' }

  stages {
    stage('Push build') {
      steps {
        withCredentials([string(credentialsId: 'aeon-token', variable: 'AEON_TOKEN')]) {
          sh 'aeon builds push ./dist/ue.tar.gz --tag "\${GIT_COMMIT}" --commit "\${GIT_COMMIT}"'
        }
      }
    }

    stage('Conformance') {
      parallel {
        stage('NAS')  { steps { runCampaign('nas')  } }
        stage('RRC')  { steps { runCampaign('rrc')  } }
        stage('PDCP') { steps { runCampaign('pdcp') } }
      }
    }
  }

  post {
    always {
      junit 'reports/**/junit-*.xml'
      archiveArtifacts artifacts: 'evidence/**', allowEmptyArchive: true
    }
  }
}

def runCampaign(String name) {
  withCredentials([string(credentialsId: 'aeon-token', variable: 'AEON_TOKEN')]) {
    sh """
      aeon exec run --campaign \${name} --build "\${GIT_COMMIT}" --wait --exit-code --quiet
      aeon reports get --build "\${GIT_COMMIT}" --campaign \${name} \\
        --format junit --output reports/junit-\${name}.xml
    """
  }
}`,
        },
      },
      {
        heading: "Why parallel stages are safe",
        paragraphs: [
          "Each campaign reserves its own lane, so parallel Jenkins stages do not contend for a shared physical tester. This is the single largest workflow change versus a racked box: concurrency is a quota question, not a scheduling conflict between teams.",
        ],
      },
    ],
  },
  {
    slug: "regression-pipelines",
    title: "Designing a conformance regression pipeline",
    description:
      "How to structure smoke, regression, nightly, and certification tiers so conformance feedback arrives in minutes without burning lane budget.",
    group: "CI/CD",
    keywords: ["regression pipeline", "test tiering", "conformance ci strategy"],
    readMinutes: 7,
    blocks: [
      {
        paragraphs: [
          "The mistake teams make when conformance suddenly becomes cheap is running everything on every commit. Tier the work instead: fast feedback on the cases that catch most regressions, deep coverage on a schedule.",
        ],
      },
      {
        table: {
          columns: ["Tier", "Scope", "Trigger", "Target time", "Blocking"],
          rows: [
            ["smoke", "12 cases, 1 lane", "every push", "under 20 min", "yes"],
            ["regression", "180 cases, 4 lanes", "merge to main", "under 3 h", "no"],
            ["nightly", "647 applicable, 8-12 lanes", "02:00 schedule", "overnight", "no"],
            ["certification", "full suite", "release candidate", "2-4 days", "release gate"],
          ],
        },
      },
      {
        heading: "Choosing the smoke set",
        bullets: [
          "Every case that failed in the last 90 days.",
          "One case per protocol domain (NAS, RRC, PDCP, RLC, MAC).",
          "Initial registration and PDU session establishment — these break first.",
          "Any case touching code changed in the diff, if you maintain a mapping.",
        ],
      },
      {
        heading: "Automate smoke-set selection",
        code: {
          lang: "bash",
          body: `aeon exec list --state verdict --since 90d --json \\
  | jq -r '.[].cases[] | select(.verdict=="fail") | .id' \\
  | sort -u > .aeon/flaky-and-failing.txt

aeon exec run --cases-from .aeon/flaky-and-failing.txt --build "$GIT_SHA" --wait --exit-code`,
        },
        note: "Review the smoke set monthly. A gate nobody trusts gets bypassed, and a gate that takes an hour gets disabled.",
      },
    ],
  },
];
