import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Calendar,
  ExternalLink,
  ClipboardList,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Microscope,
  Award,
  Play,
  Upload,
  FileJson,
  AlertTriangle,
  XCircle,
  Code,
  Terminal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface DayInfo {
  id: string;
  week: string;
  title: string;
  overviewTasks: string[];
  trackerTasks: string[];
  outcome: string;
  links: { name: string; url: string }[];
}

const PLAN: DayInfo[] = [
  {
    id: "d1",
    week: "Week 1",
    title: "Day 1: What Is a Clinical Trial?",
    overviewTasks: [
      "Learn what clinical trials are and why they are conducted.",
      "Understand the basic trial phases I-IV at a beginner level.",
      "Create a simple journey map: idea → testing → approval → patient use."
    ],
    outcome: "Student can explain, in simple language, how a medicine is tested before public use.",
    links: [
      { name: "FDA: Learn About Drug and Device Approvals", url: "https://www.fda.gov/patients/learn-about-drug-and-device-approvals" },
      { name: "FDA: Step 3 - Clinical Research", url: "https://www.fda.gov/patients/drug-development-process/step-3-clinical-research" },
      { name: "Video: Drug Discovery Process", url: "https://www.youtube.com/watch?v=DhxD6sVQEYc" }
    ],
    trackerTasks: [
      "Watch the Drug Discovery Process video (link in Program Overview).",
      "Write one sentence in your own words: \"A clinical trial is...\".",
      "List 3 reasons why scientists test medicines before people use them.",
      "Read the FDA \"Learn About Approvals\" page (top section only).",
      "Learn the 4 trial phases and write one line about each phase.",
      "Draw a journey map: idea -> testing -> approval -> patient use.",
      "Explain your journey map out loud to a parent or mentor."
    ]
  },
  {
    id: "d2",
    week: "Week 1",
    title: "Day 2: How Clinical Data Is Collected",
    overviewTasks: [
      "Learn what patient study data looks like.",
      "Review a mock Case Report Form (CRF).",
      "Identify common fields such as patient ID, visit, age, sex, and measurements."
    ],
    outcome: "Student understands that clinical data is collected in structured forms and later moved into datasets.",
    links: [
      { name: "CDISC eCRF Portal (Sample Case Report Forms)", url: "https://www.cdisc.org/kb/ecrf" },
      { name: "Video: Annotated CRF with SDTM Variables", url: "https://www.youtube.com/watch?v=Q1lioYZCeCw" }
    ],
    trackerTasks: [
      "Learn what \"patient study data\" means with a simple example.",
      "Watch the Annotated CRF with SDTM Variables video (link in Program Overview).",
      "Open and look at a mock Case Report Form (CRF) from the CDISC eCRF Portal.",
      "Circle or list 5 fields you see on the form.",
      "Match each field to a type: ID, date, number, or category.",
      "Write why a Patient ID must be unique for every person.",
      "Draw how a paper form becomes a row in a data table."
    ]
  },
  {
    id: "d3",
    week: "Week 1",
    title: "Day 3: Why Data Standards Matter",
    overviewTasks: [
      "Compare messy data with standardized data.",
      "Discuss why consistency matters in science and healthcare.",
      "Create a small raw-data versus clean-data comparison chart."
    ],
    outcome: "Student can explain why the same type of information should be captured in a consistent format.",
    links: [
      { name: "CDISC Standards Overview", url: "https://www.cdisc.org/standards" }
    ],
    trackerTasks: [
      "Look at one messy data example and one clean data example.",
      "List 3 problems you notice in the messy data.",
      "Write why \"M\", \"Male\", and \"male\" being mixed is a problem.",
      "Make a 2-column chart: Raw Data vs. Clean Data.",
      "Fix 3 messy rows by hand to make them consistent.",
      "Say one reason consistency matters in hospitals."
    ]
  },
  {
    id: "d4",
    week: "Week 1",
    title: "Day 4: SDTM Basics",
    overviewTasks: [
      "Introduce SDTM as an organized way to store study data.",
      "Review simple domains such as DM (Demographics), AE (Adverse Events), and VS (Vital Signs).",
      "Open sample data files and identify key columns."
    ],
    outcome: "Student can recognize that different datasets store different categories of clinical trial information.",
    links: [
      { name: "CDISC Dataset Generator (Sample SDTM Data)", url: "https://cdiscdataset.com/" },
      { name: "PHUSE Public Sample Data", url: "https://github.com/phuse-org/phuse-scripts/tree/master/data" },
      { name: "Video: SDTM Overview", url: "https://www.youtube.com/shorts/Y0S3L2rgQ_w" },
      { name: "Video: ADaM Overview", url: "https://www.youtube.com/shorts/sEgMitsdNTM" }
    ],
    trackerTasks: [
      "Watch the SDTM Overview video (link in Program Overview).",
      "Watch the ADaM Overview video (link in Program Overview, optional).",
      "Learn that SDTM is just an organized way to store study data.",
      "Read what the DM (Demographics) domain holds.",
      "Read what the AE (Adverse Events) domain holds.",
      "Read what the VS (Vital Signs) domain holds.",
      "Generate or download a sample dataset from the CDISC Dataset Generator.",
      "Open a sample data file and look at the columns.",
      "Write down 3 column names and what each one means.",
      "Match each sample file to the correct domain (DM/AE/VS)."
    ]
  },
  {
    id: "d5",
    week: "Week 1",
    title: "Day 5: Why Data Quality Matters",
    overviewTasks: [
      "Review examples of missing, duplicate, or badly formatted data.",
      "Discuss how poor-quality data can affect decisions.",
      "Prepare a short summary with three examples of bad data."
    ],
    outcome: "Student understands that data quality checks are important before analysis or submission.",
    links: [
      { name: "FDA for Patients", url: "https://www.fda.gov/patients" },
      { name: "Video: SDTM Validation", url: "https://www.youtube.com/watch?v=h1uJCZtCoBQ" }
    ],
    trackerTasks: [
      "Watch the SDTM Validation video (link in Program Overview).",
      "Learn the words: missing, duplicate, and wrong format.",
      "Find 1 example of a missing value in sample data.",
      "Find 1 example of a duplicate ID in sample data.",
      "Find 1 example of a badly formatted date.",
      "Write 2 sentences on how bad data could hurt a decision.",
      "Make a short summary slide with your 3 bad-data examples."
    ]
  },
  {
    id: "d6",
    week: "Week 2",
    title: "Day 6: Python Basics for Data",
    overviewTasks: [
      "Open Google Colab or Jupyter Notebook.",
      "Install or import pandas.",
      "Read a CSV file and print the first few rows."
    ],
    outcome: "Student can load a dataset and view its structure using beginner-level Python.",
    links: [
      { name: "Google Colab", url: "https://colab.research.google.com" },
      { name: "CDISC Dataset Generator (Download CSV Sample Data)", url: "https://cdiscdataset.com/" },
      { name: "pandas Intro Tutorial", url: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/01_table_oriented.html" }
    ],
    trackerTasks: [
      "Open Google Colab and create a new notebook.",
      "Type and run your first line: print(\"Hello\").",
      "Import pandas with: import pandas as pd.",
      "Upload or load a sample CSV file.",
      "Read the CSV into a variable using pd.read_csv().",
      "Show the first rows with df.head().",
      "Print how many rows and columns with df.shape."
    ]
  },
  {
    id: "d7",
    week: "Week 2",
    title: "Day 7: Understanding Data Validation",
    overviewTasks: [
      "Learn what validation means in data work.",
      "Identify common checks such as missing values and duplicate IDs.",
      "List the checks students want to implement in code."
    ],
    outcome: "Student can describe what a validation rule is and provide examples.",
    links: [
      { name: "Video: SDTM Validation", url: "https://www.youtube.com/watch?v=h1uJCZtCoBQ" },
      { name: "CDISC Dataset Generator (Sample SDTM Data)", url: "https://cdiscdataset.com/" }
    ],
    trackerTasks: [
      "Learn what \"validation\" means in simple words.",
      "List 4 common checks (missing, duplicate, format, range).",
      "Pick which checks you want to build in your project.",
      "Write each chosen check as a plain-English sentence.",
      "Decide what a PASS and a FAIL should look like."
    ]
  },
  {
    id: "d8",
    week: "Week 2",
    title: "Day 8: Define the 5 Core Rules",
    overviewTasks: [
      "Translate each rule into plain English.",
      "Write simple logic or pseudocode for each rule.",
      "Choose which dataset columns are needed for each check."
    ],
    outcome: "Student can map a business rule into a logical validation step.",
    links: [
      { name: "CDISC Dataset Generator (Sample SDTM Data)", url: "https://cdiscdataset.com/" },
      { name: "PHUSE Public Sample Data", url: "https://github.com/phuse-org/phuse-scripts/tree/master/data" },
      { name: "CDISC Standards Overview", url: "https://www.cdisc.org/standards" }
    ],
    trackerTasks: [
      "Rule 1: every Patient ID must be unique.",
      "Rule 2: required fields must not be empty.",
      "Rule 3: dates must follow the right format.",
      "Rule 4: the domain/dataset name must match.",
      "Rule 5: a simple status value must be valid.",
      "Write pseudocode (plain steps) for each of the 5 rules.",
      "List which columns each rule needs."
    ]
  },
  {
    id: "d9",
    week: "Week 2",
    title: "Day 9: Build the Python Validator",
    overviewTasks: [
      "Code checks for duplicate IDs, missing required fields, date format, domain name alignment, and simple status logic.",
      "Print PASS/FAIL messages.",
      "Create a summary of issues found."
    ],
    outcome: "Student has a working beginner-level script that checks sample data and reports simple errors.",
    links: [
      { name: "Google Colab", url: "https://colab.research.google.com" },
      { name: "pandas Documentation", url: "https://pandas.pydata.org/" }
    ],
    trackerTasks: [
      "Write code to check for duplicate IDs.",
      "Write code to check for missing required fields.",
      "Write code to check the date format.",
      "Write code to check the domain name matches.",
      "Write code to check the status value is valid.",
      "Print a PASS or FAIL message for each rule.",
      "Print a summary of how many issues were found.",
      "Test the script on a sample dataset and fix any errors."
    ]
  },
  {
    id: "d10",
    week: "Week 2",
    title: "Day 10: Final Presentation and Demo",
    overviewTasks: [
      "Prepare a short presentation covering what was learned.",
      "Show the sample datasets used.",
      "Demo the validator and explain the results."
    ],
    outcome: "Student presents the problem, explains the logic, and demonstrates the project clearly.",
    links: [
      { name: "Canva for Students", url: "https://www.canva.com/education/students/" }
    ],
    trackerTasks: [
      "Make 5-8 slides covering what you learned.",
      "Add a slide showing the sample datasets you used.",
      "Add a slide listing your 5 validation rules.",
      "Add a slide with a screenshot of your code output.",
      "Practice your demo out loud at least once.",
      "Present and run the validator live for your mentor."
    ]
  }
];

const STORAGE_KEY = "ctm_tracker_v1";

const CELL1_DEFAULT = `# Cell 1: Load and preview the dataset
import pandas as pd
print("Loading dataset: dataset.csv ...")
df = pd.read_csv("dataset.csv")
print(f"Dataset successfully loaded. Total rows: {len(df)}")
df.head()`;

const CELL2_DEFAULT = `# Cell 2: Run the 5 simple validation rules
issues = 0
results = []

# Get expected domain (DM or VS) from the first row
domain_type = df["DOMAIN"].iloc[0]

# --- Rule 1: Patient ID Uniqueness ---
# Let's count how many times each patient ID appears
patient_ids = list(df["USUBJID"])
duplicate_ids = []
for pid in patient_ids:
    if patient_ids.count(pid) > 1 and pid not in duplicate_ids:
        duplicate_ids.append(pid)

if len(duplicate_ids) > 0:
    results.append(f"[FAIL] Rule 1: Duplicate Patient ID values found: {duplicate_ids}")
    issues += len(duplicate_ids)
else:
    results.append("[PASS] Rule 1: All Patient IDs (USUBJID) are unique.")

# --- Rule 2: Required Fields Not Empty ---
# Check if any ID or Domain is blank. For DM check SEX. For VS check VSTESTCD/VSDTC.
empty_count = 0
for index, row in df.iterrows():
    if pd.isna(row["USUBJID"]) or str(row["USUBJID"]).strip() == "":
        empty_count += 1
    if pd.isna(row["DOMAIN"]) or str(row["DOMAIN"]).strip() == "":
        empty_count += 1
    if domain_type == "DM":
        if pd.isna(row["SEX"]) or str(row["SEX"]).strip() == "":
            empty_count += 1
    elif domain_type == "VS":
        if pd.isna(row["VSTESTCD"]) or str(row["VSTESTCD"]).strip() == "":
            empty_count += 1
        if pd.isna(row["VSDTC"]) or str(row["VSDTC"]).strip() == "":
            empty_count += 1

if empty_count > 0:
    results.append(f"[FAIL] Rule 2: Found {empty_count} blank required fields.")
    issues += empty_count
else:
    results.append("[PASS] Rule 2: No blank fields in required columns.")

# --- Rule 3: Date Format Check (YYYY-MM-DD) ---
# Simple string checks: length must be 10, characters at index 4 and 7 must be "-"
bad_dates = 0
for index, row in df.iterrows():
    date_val = ""
    if "BRTHDTC" in row:
        date_val = str(row["BRTHDTC"])
    elif "VSDTC" in row:
        date_val = str(row["VSDTC"])
        
    if date_val and date_val != "nan":
        if len(date_val) != 10 or date_val[4] != "-" or date_val[7] != "-":
            bad_dates += 1

if bad_dates > 0:
    results.append(f"[FAIL] Rule 3: Found {bad_dates} dates with wrong format (should be YYYY-MM-DD).")
    issues += bad_dates
else:
    results.append("[PASS] Rule 3: All dates follow the YYYY-MM-DD format.")

# --- Rule 4: Domain Prefix Match ---
# Check if every row's DOMAIN matches our target domain type
mismatches = 0
for index, row in df.iterrows():
    if row["DOMAIN"] != domain_type:
        mismatches += 1

if mismatches > 0:
    results.append(f"[FAIL] Rule 4: Found {mismatches} rows matching wrong domain.")
    issues += mismatches
else:
    results.append(f"[PASS] Rule 4: All rows match expected domain '{domain_type}'.")

# --- Rule 5: Status or Sex Validity ---
# For DM: SEX must be 'M' or 'F'. For VS: VSSTAT must be 'DONE', 'NOT DONE', or 'C'.
invalid_values = 0
for index, row in df.iterrows():
    if domain_type == "DM":
        if row["SEX"] not in ["M", "F"]:
            invalid_values += 1
    elif domain_type == "VS":
        if "VSSTAT" in row and pd.notna(row["VSSTAT"]):
            if row["VSSTAT"] not in ["DONE", "NOT DONE", "C"]:
                invalid_values += 1

if invalid_values > 0:
    results.append(f"[FAIL] Rule 5: Found {invalid_values} invalid SEX or VSSTAT values.")
    issues += invalid_values
else:
    results.append("[PASS] Rule 5: All SEX/VSSTAT values are valid.")`;

const CELL3_DEFAULT = `# Cell 3: Compile and print the final report summary
conformance_score = max(0, 100 - (issues * 10))
print("=============================")
print("Validation Report Summary")
print("=============================")
for res in results:
    print(res)
print("-----------------------------")
print(f"Conformance Score: {conformance_score}%")
print(f"Total Issues Detected: {issues}")`;

const MOCK_DATASETS = {
  dm_clean: {
    name: 'dm_clean_2026.csv',
    domain: 'DM',
    content: `USUBJID,DOMAIN,SEX,BRTHDTC
SUBJ-001,DM,M,2008-05-14
SUBJ-002,DM,F,2007-11-22
SUBJ-003,DM,F,2008-01-09
SUBJ-004,DM,M,2009-03-30`
  },
  dm_messy: {
    name: 'dm_messy_2026.csv',
    domain: 'DM',
    content: `USUBJID,DOMAIN,SEX,BRTHDTC
SUBJ-001,DM,M,2008-05-14
SUBJ-002,DM,F,07/22/2007
SUBJ-003,DM,X,2008-01-09
SUBJ-001,DM,M,2008-05-14
SUBJ-005,VS,F,2009-02-12
,DM,M,2007-06-15`
  },
  vs_clean: {
    name: 'vs_clean_2026.csv',
    domain: 'VS',
    content: `USUBJID,DOMAIN,VSTESTCD,VSORRES,VSDTC,VSSTAT
SUBJ-001,VS,SYSBP,120,2026-06-01,DONE
SUBJ-002,VS,DIABP,80,2026-06-01,DONE
SUBJ-003,VS,SYSBP,118,2026-06-02,DONE
SUBJ-004,VS,DIABP,,2026-06-02,NOT DONE`
  },
  vs_messy: {
    name: 'vs_messy_2026.csv',
    domain: 'VS',
    content: `USUBJID,DOMAIN,VSTESTCD,VSORRES,VSDTC,VSSTAT
SUBJ-001,VS,SYSBP,120,06-01-2026,DONE
SUBJ-002,DM,DIABP,80,2026-06-01,DONE
SUBJ-003,VS,SYSBP,,2026-06-02,DONE
SUBJ-003,VS,DIABP,82,2026-06-02,INVALID_STATUS
,VS,SYSBP,115,2026-06-03,DONE`
  }
};

interface RuleResult {
  ruleNumber: number;
  name: string;
  description: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
  errors: string[];
}

interface ValidationReport {
  fileName: string;
  domain: string;
  rowCount: number;
  conformance: number;
  issuesCount: number;
  rules: RuleResult[];
}

export default function SummerProject() {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'tracker' | 'sdtm-validator'>('overview');
  const [state, setState] = useState<Record<string, boolean>>({});

  // SDTM Validator state
  const [loadedFileName, setLoadedFileName] = useState<string>('dm_messy_2026.csv');
  const [loadedDomain, setLoadedDomain] = useState<string>('DM');
  const [csvContent, setCsvContent] = useState<string>(MOCK_DATASETS.dm_messy.content.trim());
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [expandedRule, setExpandedRule] = useState<number | null>(null);

  // Editable notebook cells
  const [cell1Code, setCell1Code] = useState<string>(CELL1_DEFAULT);
  const [cell2Code, setCell2Code] = useState<string>(CELL2_DEFAULT);
  const [cell3Code, setCell3Code] = useState<string>(CELL3_DEFAULT);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load tracker progress', e);
    }
  }, []);

  const saveState = (newState: Record<string, boolean>) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.error('Failed to save tracker progress', e);
    }
  };

  const handleToggle = (key: string) => {
    const newState = { ...state };
    if (newState[key]) {
      delete newState[key];
    } else {
      newState[key] = true;
    }
    saveState(newState);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all task progress?")) {
      saveState({});
    }
  };

  // Stats calculation
  let totalTasksCount = 0;
  let completedTasksCount = 0;
  PLAN.forEach(day => {
    day.trackerTasks.forEach((_, idx) => {
      totalTasksCount++;
      if (state[`${day.id}:${idx}`]) {
        completedTasksCount++;
      }
    });
  });

  const overallPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const getDayStats = (day: DayInfo) => {
    let done = 0;
    day.trackerTasks.forEach((_, idx) => {
      if (state[`${day.id}:${idx}`]) done++;
    });
    const total = day.trackerTasks.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { done, total, pct };
  };

  // Upload handler for custom CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Detect domain from file name (default DM)
    let domain = 'DM';
    if (file.name.toLowerCase().includes('vs')) {
      domain = 'VS';
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setLoadedFileName(file.name);
      setLoadedDomain(domain);
      setCsvContent(text.trim());
      setValidationReport(null);
      setExpandedRule(null);
    };
    reader.readAsText(file);
  };

  // Reset Notebook to defaults
  const handleResetNotebook = () => {
    if (window.confirm("Reset all Jupyter Notebook code cells to default?")) {
      setCell1Code(CELL1_DEFAULT);
      setCell2Code(CELL2_DEFAULT);
      setCell3Code(CELL3_DEFAULT);
      setCsvContent(MOCK_DATASETS.dm_messy.content.trim());
      setLoadedFileName('dm_messy_2026.csv');
      setLoadedDomain('DM');
      setValidationReport(null);
      setExpandedRule(null);
    }
  };

  // Run the validator logic (evaluating the 5 rules in JS)
  const runValidationEngine = () => {
    if (!csvContent) return;
    setIsValidating(true);
    setValidationReport(null);

    setTimeout(() => {
      const lines = csvContent.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      if (lines.length < 2) {
        setIsValidating(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const records = lines.slice(1).map(l => l.split(',').map(cell => cell.trim()));

      const usubjidIdx = headers.indexOf('USUBJID');
      const domainIdx = headers.indexOf('DOMAIN');
      const sexIdx = headers.indexOf('SEX');
      const vstestcdIdx = headers.indexOf('VSTESTCD');
      const vsdtcIdx = headers.indexOf('VSDTC');
      const vsstatIdx = headers.indexOf('VSSTAT');

      const rules: RuleResult[] = [
        {
          ruleNumber: 1,
          name: "Rule 1: Patient ID Uniqueness (USUBJID)",
          description: "Verify that each patient identifier is unique within the study demographics dataset.",
          status: 'PENDING',
          errors: []
        },
        {
          ruleNumber: 2,
          name: "Rule 2: Required Fields Not Empty",
          description: "Check that critical variables (USUBJID, DOMAIN, SEX for DM, VSTESTCD/VSDTC for VS) are not blank.",
          status: 'PENDING',
          errors: []
        },
        {
          ruleNumber: 3,
          name: "Rule 3: Date Format Alignment",
          description: "Ensure that all date variables ending in 'DTC' conform to the ISO 8601 date format (YYYY-MM-DD).",
          status: 'PENDING',
          errors: []
        },
        {
          ruleNumber: 4,
          name: "Rule 4: Domain Prefix Match",
          description: "Verify that values in the 'DOMAIN' column exactly match the expected dataset type (e.g. DM or VS).",
          status: 'PENDING',
          errors: []
        },
        {
          ruleNumber: 5,
          name: "Rule 5: Status or Sex Validity",
          description: "Validate SEX values in DM (M, F) or VSSTAT values in VS (DONE, NOT DONE, C).",
          status: 'PENDING',
          errors: []
        }
      ];

      let totalIssues = 0;

      // -------------------------------------------
      // Rule 1: USUBJID uniqueness
      // -------------------------------------------
      if (usubjidIdx === -1) {
        rules[0].errors.push("Missing required variable header 'USUBJID'.");
      } else {
        const usubjidList = records.map((r, i) => ({ id: r[usubjidIdx], row: i + 2 }));
        const counts: Record<string, number[]> = {};
        usubjidList.forEach(item => {
          if (item.id && item.id.trim() !== '') {
            if (!counts[item.id]) counts[item.id] = [];
            counts[item.id].push(item.row);
          }
        });
        Object.keys(counts).forEach(id => {
          if (counts[id].length > 1) {
            rules[0].errors.push(`Duplicate ID '${id}' found on records on lines: ${counts[id].join(', ')}.`);
          }
        });
      }
      rules[0].status = rules[0].errors.length > 0 ? 'FAIL' : 'PASS';
      totalIssues += rules[0].errors.length;

      // -------------------------------------------
      // Rule 2: Required columns and fields cannot be empty
      // -------------------------------------------
      const requiredCols = ['USUBJID', 'DOMAIN'];
      if (loadedDomain === 'DM') requiredCols.push('SEX');
      if (loadedDomain === 'VS') requiredCols.push('VSTESTCD', 'VSDTC');

      requiredCols.forEach(col => {
        const idx = headers.indexOf(col);
        if (idx === -1) {
          rules[1].errors.push(`Required column '${col}' is missing entirely from headers.`);
        } else {
          records.forEach((r, rowIdx) => {
            const val = r[idx];
            if (!val || val.trim() === '') {
              rules[1].errors.push(`Row ${rowIdx + 2}: Required field '${col}' is blank.`);
            }
          });
        }
      });
      rules[1].status = rules[1].errors.length > 0 ? 'FAIL' : 'PASS';
      totalIssues += rules[1].errors.length;

      // -------------------------------------------
      // Rule 3: Dates follow ISO 8601 format (YYYY-MM-DD)
      // -------------------------------------------
      const dateCols = headers.filter(h => h.endsWith('DTC'));
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      dateCols.forEach(col => {
        const idx = headers.indexOf(col);
        records.forEach((r, rowIdx) => {
          const val = r[idx];
          if (val && val.trim() !== '' && !datePattern.test(val.trim())) {
            rules[2].errors.push(`Row ${rowIdx + 2}: Column '${col}' has invalid date '${val}' (expected format YYYY-MM-DD).`);
          }
        });
      });
      rules[2].status = rules[2].errors.length > 0 ? 'FAIL' : 'PASS';
      totalIssues += rules[2].errors.length;

      // -------------------------------------------
      // Rule 4: Domain prefix must align
      // -------------------------------------------
      if (domainIdx === -1) {
        rules[3].errors.push("Required column 'DOMAIN' is missing from headers.");
      } else {
        records.forEach((r, rowIdx) => {
          const val = r[domainIdx];
          if (val !== loadedDomain) {
            rules[3].errors.push(`Row ${rowIdx + 2}: DOMAIN prefix '${val}' does not match expected domain profile '${loadedDomain}'.`);
          }
        });
      }
      rules[3].status = rules[3].errors.length > 0 ? 'FAIL' : 'PASS';
      totalIssues += rules[3].errors.length;

      // -------------------------------------------
      // Rule 5: Status or Sex values are valid
      // -------------------------------------------
      if (loadedDomain === 'DM') {
        if (sexIdx === -1) {
          rules[4].errors.push("Required variable 'SEX' is missing from Demographic headers.");
        } else {
          const validSex = ['M', 'F'];
          records.forEach((r, rowIdx) => {
            const val = r[sexIdx];
            if (val && !validSex.includes(val)) {
              rules[4].errors.push(`Row ${rowIdx + 2}: SEX value '${val}' is invalid (must be 'M' or 'F').`);
            }
          });
        }
      } else if (loadedDomain === 'VS') {
        if (vsstatIdx !== -1) {
          const validStats = ['DONE', 'NOT DONE', 'C'];
          records.forEach((r, rowIdx) => {
            const val = r[vsstatIdx];
            if (val && val.trim() !== '' && !validStats.includes(val)) {
              rules[4].errors.push(`Row ${rowIdx + 2}: Status 'VSSTAT' value '${val}' is invalid (must be 'DONE', 'NOT DONE', or 'C').`);
            }
          });
        }
      }
      rules[4].status = rules[4].errors.length > 0 ? 'FAIL' : 'PASS';
      totalIssues += rules[4].errors.length;

      // Conformance calculation
      let failedRules = 0;
      rules.forEach(r => { if (r.status === 'FAIL') failedRules++; });
      const conformanceScore = Math.max(0, 100 - failedRules * 20);

      setValidationReport({
        fileName: loadedFileName,
        domain: loadedDomain,
        rowCount: records.length,
        conformance: conformanceScore,
        issuesCount: totalIssues,
        rules: rules
      });
      setIsValidating(false);
    }, 1000);
  };

  const currentCsvRows = csvContent ? csvContent.split('\n').slice(0, 8).map(row => row.split(',')) : [];
  const totalCsvRowsCount = csvContent ? csvContent.split('\n').length - 1 : 0;

  // Emulated Notebook logs
  const getEmulatedNotebookLogs = () => {
    if (!validationReport) return [];
    return [
      `In [1]: # Executing Load Dataset Cell`,
      `Loading dataset: dataset.csv ...`,
      `[INFO] Target File: ${validationReport.fileName}`,
      `Dataset successfully loaded. Total rows: ${validationReport.rowCount}`,
      `Loaded Columns: ${csvContent.split('\n')[0]}`,
      ``,
      `In [2]: # Executing Validation Rules Cell`,
      `--- Running 5 CDISC SDTM validation rules ---`,
      ...validationReport.rules.map(r => 
        r.status === 'PASS' 
          ? `[PASS] ${r.name}: Conforms perfectly.` 
          : `[FAIL] ${r.name}: Detected ${r.errors.length} non-conformant record(s).`
      ),
      ``,
      `In [3]: # Executing Print Report Cell`,
      `=============================`,
      `Validation Report Summary`,
      `=============================`,
      `Conformance Score: ${validationReport.conformance}%`,
      `Total Issues Detected: ${validationReport.issuesCount}`,
      `Validation execution completed.`
    ];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Panel (Shrunk & Compact) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black font-display text-slate-800 tracking-tight">
              Clinical Trials Summer (2026) Program Planner
            </h2>
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-100 uppercase shrink-0">
              Summer Project
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Mentor: Savitha Subramaniam, Associate Director, IQVIA Inc
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 flex-wrap">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold text-sm transition-all duration-200 ${
            activeSubTab === 'overview'
              ? 'border-green-600 text-green-700 bg-green-50/25'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Program Overview
        </button>
        <button
          onClick={() => setActiveSubTab('tracker')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold text-sm transition-all duration-200 ${
            activeSubTab === 'tracker'
              ? 'border-green-600 text-green-700 bg-green-50/25'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Detailed Task Tracker
          {completedTasksCount > 0 && (
            <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
              {overallPercentage}%
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('sdtm-validator')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold text-sm transition-all duration-200 ${
            activeSubTab === 'sdtm-validator'
              ? 'border-green-600 text-green-700 bg-green-50/25'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code className="w-4 h-4" />
          CDISC SDTM Validator
        </button>
      </div>

      {/* Tab Contents */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8">
          {/* Week Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Week 1 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs font-bold text-green-600 uppercase tracking-wider bg-green-50 px-2.5 py-1 rounded-md w-fit">
                  Week 1 • Foundations
                </div>
                <h3 className="text-lg font-bold text-slate-800">Week 1 Objective</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Build a basic understanding of clinical trials, patient data collection, data standards, and why data quality matters in clinical research.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Expected Outcome</span>
                <p className="text-xs text-slate-700 bg-green-50/50 border-l-4 border-green-600 p-2.5 rounded-r-lg font-medium">
                  Students can explain the clinical trial lifecycle, describe what study data looks like, and recognize why organized, standardized data is important.
                </p>
              </div>
            </div>

            {/* Week 2 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md w-fit">
                  Week 2 • Application
                </div>
                <h3 className="text-lg font-bold text-slate-800">Week 2 Objective</h3>
                <p className="text-sm text-slate-655 leading-relaxed">
                  Move from concepts into practice by reading simple datasets, defining data verification checks, and building a beginner-friendly Python validator.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Expected Outcome</span>
                <p className="text-xs text-slate-700 bg-indigo-50/50 border-l-4 border-indigo-600 p-2.5 rounded-r-lg font-medium">
                  Students can load a CSV file, understand basic validation rules, and demonstrate a small Python project that detects data issues.
                </p>
              </div>
            </div>
          </div>

          {/* Day Grid */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800 border-l-4 border-green-600 pl-3">Day-by-Day Syllabus</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PLAN.map((day) => (
                <div key={day.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{day.week}</span>
                      <span className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-semibold">
                        <Calendar className="w-3 h-3" />
                        {day.title.split(":")[0]}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-base">{day.title}</h4>
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Day Tasks</span>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-650 leading-relaxed pl-1">
                        {day.overviewTasks.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Expected Outcome</span>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {day.outcome}
                      </p>
                    </div>
                    {day.links.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Reference Links</span>
                        <div className="flex flex-wrap gap-2">
                          {day.links.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-green-600 hover:text-green-800 bg-green-50/50 hover:bg-green-50 px-2 py-1 rounded border border-green-105 font-semibold transition-colors"
                            >
                              <span>{link.name}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Project Expected Output */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-slate-100 space-y-6 relative overflow-hidden shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-500/10 text-green-400 rounded-xl border border-green-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Expected Final Project Output</h3>
                <p className="text-xs text-slate-400">All student work culminates in this initial prototype.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-350 leading-relaxed">
              <div className="space-y-4">
                <ul className="space-y-3 list-none pl-0">
                  <li className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                    <div>
                      <strong className="text-slate-200">Python Script:</strong> Reads at least 2 sample datasets such as DM (Demographics) and VS (Vital Signs) or AE (Adverse Events) using pandas.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                    <div>
                      <strong className="text-slate-200">Validation Rules Implemented:</strong> 5 simple checks including unique ID, required fields, date format, dataset/domain match, and a basic status rule.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="text-slate-200">Output Report:</strong> Printed summary showing PASS/FAIL and the total number of issues found in the console/notebook.
                    </div>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <ul className="space-y-3 list-none pl-0">
                  <li className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</span>
                    <div>
                      <strong className="text-slate-200">Presentation Deck:</strong> 5-8 slides explaining clinical trials basics, datasets used, validation rules, code approach, and demo results.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">5</span>
                    <div>
                      <strong className="text-slate-200">Demo Evidence:</strong> Screenshot or Google Colab notebook output demonstrating errors detected in the sample data.
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Sample Output Report Mockup</span>
              <pre className="bg-black/40 border border-slate-800 text-green-400 p-4 rounded-xl font-mono text-xs overflow-auto max-w-full leading-relaxed">
{`Validation Summary
------------------
USUBJID uniqueness: FAILED (2 duplicates)
Required fields: PASSED
Date format: FAILED (3 invalid dates)
Domain check: PASSED
Status rule: FAILED (2 invalid entries)`}
              </pre>
            </div>

            <div className="pt-4 border-t border-slate-850 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Public Reference Links for Final Project</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "CDISC Dataset Generator", url: "https://cdiscdataset.com/" },
                  { name: "PHUSE Public Sample Data", url: "https://github.com/phuse-org/phuse-scripts/tree/master/data" },
                  { name: "CDISC Standards Overview", url: "https://www.cdisc.org/standards" },
                  { name: "Google Colab", url: "https://colab.research.google.com" },
                  { name: "pandas Documentation", url: "https://pandas.pydata.org/" }
                ].map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-green-400 hover:text-green-300 bg-green-950/40 hover:bg-green-950/70 px-2.5 py-1 rounded border border-green-900/50 transition-colors"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'tracker' && (
        <div className="space-y-6">
          {/* Progress Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-800">Overall Completion Status</h3>
                <p className="text-xs text-slate-500">
                  Tick each small task as it is completed. The bar below tracks your overall project completion progress.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-green-600">{overallPercentage}%</span>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-655 rounded-xl text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Progress
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/55">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-indigo-605 rounded-full transition-all duration-300"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>{completedTasksCount} of {totalTasksCount} tasks complete</span>
              {overallPercentage === 100 && (
                <span className="text-green-600 font-bold animate-bounce">
                  Program finished! 🎉 Double check with your mentor.
                </span>
              )}
            </div>
          </div>

          {/* Tracker Day Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {PLAN.map((day) => {
              const { done, total, pct } = getDayStats(day);
              const isStarted = done > 0;
              const isCompleted = done === total;

              return (
                <div key={day.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Day Card Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{day.week}</span>
                        <h4 className="font-bold text-slate-800 text-sm">{day.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Day Status Pill */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : isStarted
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-50 text-slate-500 border border-slate-200'
                        }`}>
                          {isCompleted ? 'Completed' : isStarted ? 'In Progress' : 'Not Started'}
                        </span>
                        <span className="text-xs font-bold text-slate-500 font-mono">
                          {done}/{total}
                        </span>
                      </div>
                    </div>

                    {/* Day progress indicator bar */}
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    {/* Checklist */}
                    <ul className="space-y-2 pt-2">
                      {day.trackerTasks.map((task, idx) => {
                        const key = `${day.id}:${idx}`;
                        const isChecked = !!state[key];

                        return (
                          <li
                            key={idx}
                            onClick={() => handleToggle(key)}
                            className={`flex items-start gap-3 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all duration-150 ${
                              isChecked
                                ? 'bg-green-50/70 border-green-200 text-slate-500 shadow-sm'
                                : 'bg-slate-50 border-slate-100 text-slate-750 hover:bg-slate-100 hover:border-slate-200'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="mt-0.5 w-4 h-4 rounded accent-green-600 cursor-pointer border-slate-350 text-green-600 focus:ring-green-500"
                            />
                            <span className={`leading-relaxed ${isChecked ? 'line-through' : ''}`}>
                              {task}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="pt-3 flex justify-end">
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-green-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Day Complete
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSubTab === 'sdtm-validator' && (
        <div className="space-y-6">
          {/* Top section: Full-width Jupyter Notebook Code Cells */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Jupyter Python Notebook</h3>
                  <p className="text-[10px] text-slate-400 leading-none mt-1">Edit Python code cells below and execute validations</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetNotebook}
                  className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-[0.97] text-[10px] font-bold py-1.5 px-3 rounded-lg border border-slate-200 transition-all cursor-pointer"
                  title="Reset notebook code and dataset to defaults"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Cells</span>
                </button>
                <button
                  onClick={runValidationEngine}
                  disabled={isValidating}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] text-[10px] text-white font-bold py-1.5 px-3.5 rounded-lg shadow-sm border border-green-700 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isValidating ? 'Running...' : 'Run All Cells'}</span>
                </button>
              </div>
            </div>

            {/* Notebook Cells */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
              {/* Cell 1 */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Cell 1: Load CSV Data</span>
                <div className="flex gap-2 items-stretch border border-slate-200 rounded-xl bg-slate-50/50 p-2">
                  <div className="text-[9px] font-mono text-blue-600 select-none text-right w-11 font-bold pr-2 pt-1.5 border-r border-slate-250 shrink-0">
                    In [1]:
                  </div>
                  <textarea
                    value={cell1Code}
                    onChange={(e) => setCell1Code(e.target.value)}
                    className="w-full font-mono text-[10px] bg-transparent text-slate-800 focus:outline-none resize-y py-1.5 pl-2 leading-normal"
                    rows={5}
                  />
                </div>
              </div>

              {/* Cell 2 */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Cell 2: Run 5 SDTM Validation Rules</span>
                <div className="flex gap-2 items-stretch border border-slate-200 rounded-xl bg-slate-50/50 p-2">
                  <div className="text-[9px] font-mono text-blue-600 select-none text-right w-11 font-bold pr-2 pt-1.5 border-r border-slate-250 shrink-0">
                    In [2]:
                  </div>
                  <textarea
                    value={cell2Code}
                    onChange={(e) => setCell2Code(e.target.value)}
                    className="w-full font-mono text-[10px] bg-transparent text-slate-800 focus:outline-none resize-y py-1.5 pl-2 leading-normal"
                    rows={10}
                  />
                </div>
              </div>

              {/* Cell 3 */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Cell 3: Compile Report Results</span>
                <div className="flex gap-2 items-stretch border border-slate-200 rounded-xl bg-slate-50/50 p-2">
                  <div className="text-[9px] font-mono text-blue-600 select-none text-right w-11 font-bold pr-2 pt-1.5 border-r border-slate-250 shrink-0">
                    In [3]:
                  </div>
                  <textarea
                    value={cell3Code}
                    onChange={(e) => setCell3Code(e.target.value)}
                    className="w-full font-mono text-[10px] bg-transparent text-slate-800 focus:outline-none resize-y py-1.5 pl-2 leading-normal"
                    rows={6}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row: Edit Dataset and Validation Dashboard side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px] items-stretch">
            {/* Edit Dataset File Panel */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-full overflow-hidden justify-between">
              <div className="flex flex-col h-full overflow-hidden space-y-4">
                <div className="flex justify-between items-center text-[10px] shrink-0 border-b border-slate-100 pb-3">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5 text-xs">
                    <FileJson className="w-4 h-4 text-indigo-500" />
                    Edit Dataset File: <span className="text-indigo-600 font-mono font-bold">{loadedFileName}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[9px] font-mono">{totalCsvRowsCount} rows total</span>
                    <label className="flex items-center gap-1 text-slate-550 hover:text-green-700 cursor-pointer text-[9px] font-bold border border-slate-200 rounded px-1.5 py-0.5 bg-slate-50 transition-colors">
                      <Upload className="w-2.5 h-2.5" />
                      <span>Upload CSV</span>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <textarea
                  value={csvContent}
                  onChange={(e) => {
                    setCsvContent(e.target.value);
                    const firstLines = e.target.value.split('\n');
                    if (firstLines.length > 1) {
                      const cells = firstLines[1].split(',');
                      if (cells[1] === 'VS') {
                        setLoadedDomain('VS');
                      } else if (cells[1] === 'DM') {
                        setLoadedDomain('DM');
                      }
                    }
                  }}
                  className="w-full flex-grow font-mono text-[10px] bg-slate-900 text-green-400 border border-slate-850 rounded-xl p-3 focus:outline-none resize-none custom-scrollbar"
                  placeholder="Paste or type CSV lines here to test..."
                />
              </div>
            </div>

            {/* Validation Results Dashboard Panel */}
            <div className="bg-slate-950 border border-slate-850 rounded-3xl p-6 shadow-sm flex flex-col h-full overflow-hidden text-slate-100 justify-between">
              <div className="flex flex-col h-full overflow-hidden space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-slate-850 pb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-bold text-white text-sm">Validation Results Dashboard</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Rule Output</span>
                </div>

                {/* Content Area */}
                <div className="flex-grow overflow-y-auto custom-scrollbar space-y-4 pr-1">
                  {isValidating ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-3 py-10">
                      <div className="w-8 h-8 rounded-full border-4 border-t-green-500 border-green-500/20 animate-spin" />
                      <p className="text-xs font-mono text-green-400">Executing notebook cells... compiling results...</p>
                    </div>
                  ) : validationReport ? (
                    <div className="space-y-4">
                      {/* Conformance score banner */}
                      <div className="grid grid-cols-3 gap-2 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shrink-0">
                        <div className="text-center space-y-0.5">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Conformance</span>
                          <span className={`text-lg font-black ${validationReport.conformance >= 80 ? 'text-green-400' : 'text-red-400'}`}>
                            {validationReport.conformance}%
                          </span>
                        </div>
                        <div className="text-center space-y-0.5 border-x border-slate-800">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Total Issues</span>
                          <span className={`text-lg font-black ${validationReport.issuesCount > 0 ? 'text-amber-400' : 'text-green-400'}`}>
                            {validationReport.issuesCount}
                          </span>
                        </div>
                        <div className="text-center space-y-0.5">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Rows Checked</span>
                          <span className="text-lg font-black text-slate-200">
                            {validationReport.rowCount}
                          </span>
                        </div>
                      </div>

                      {/* Interactive 5 Rules list */}
                      <div className="space-y-2">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pb-1">Evaluated Plan Rules</div>
                        {validationReport.rules.map((rule) => {
                          const hasFailed = rule.status === 'FAIL';
                          const isExpanded = expandedRule === rule.ruleNumber;

                          return (
                            <div
                              key={rule.ruleNumber}
                              className={`border rounded-xl transition-all overflow-hidden ${
                                hasFailed
                                  ? 'bg-red-950/15 border-red-900/30'
                                  : 'bg-green-950/15 border-green-900/30'
                              }`}
                            >
                              {/* Rule header toggle */}
                              <div
                                onClick={() => {
                                  if (hasFailed) {
                                    setExpandedRule(isExpanded ? null : rule.ruleNumber);
                                  }
                                }}
                                className={`flex justify-between items-center p-3 text-xs select-none ${
                                  hasFailed ? 'cursor-pointer hover:bg-red-950/20' : 'cursor-default'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {hasFailed ? (
                                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                                  ) : (
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                  )}
                                  <div className="text-left">
                                    <p className="font-bold text-slate-200 leading-tight text-[11px]">{rule.name}</p>
                                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{rule.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                    hasFailed ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                                  }`}>
                                    {hasFailed ? `FAIL (${rule.errors.length})` : 'PASS'}
                                  </span>
                                  {hasFailed && (
                                    isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                </div>
                              </div>

                              {/* Expanded logs */}
                              {hasFailed && isExpanded && (
                                <div className="bg-black/45 border-t border-red-900/20 p-3 font-mono text-[9px] text-red-350 space-y-1 max-h-[140px] overflow-y-auto custom-scrollbar select-text">
                                  {rule.errors.map((err, idx) => (
                                    <div key={idx} className="flex items-start gap-1.5">
                                      <span className="text-red-500 font-bold shrink-0">↳</span>
                                      <span>{err}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Jupyter Notebook Output Terminal */}
                      <div className="space-y-1.5 pt-2">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Jupyter Notebook Output Log</div>
                        <div className="bg-black border border-slate-900 font-mono text-[9px] p-4 rounded-xl overflow-y-auto h-[160px] text-slate-350 custom-scrollbar space-y-0.5 select-text leading-relaxed">
                          {getEmulatedNotebookLogs().map((log, i) => {
                            let colorClass = 'text-slate-400';
                            if (log.startsWith('In [')) colorClass = 'text-blue-400 font-bold';
                            else if (log.startsWith('[FAIL]')) colorClass = 'text-red-400';
                            else if (log.startsWith('[PASS]')) colorClass = 'text-green-400';
                            else if (log.startsWith('Conformance Score:')) colorClass = 'text-indigo-300 font-bold';
                            else if (log.startsWith('==') || log.startsWith('--')) colorClass = 'text-slate-600';

                            return (
                              <div key={i} className={colorClass}>
                                {log}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-800 rounded-2xl py-20">
                      <Terminal className="w-10 h-10 text-slate-850 mb-3 animate-pulse" />
                      <p className="text-xs font-semibold text-slate-400">Notebook Execution Ready</p>
                      <p className="text-[10px] text-slate-500 max-w-[280px] mt-1.5">
                        Verify or edit cell codes and CSV values, then click **Run All Cells** to compile Python notebook outputs.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
