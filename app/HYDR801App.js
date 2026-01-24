'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';

// App Component
export default function HYDR801App() {
  const [appMode, setAppMode] = useState('patient'); // 'patient' or 'provider'
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [user, setUser] = useState({
    id: 'patient_001',
    name: 'Sarah',
    email: 'sarah@email.com',
    fitnessAssessmentComplete: false,
    fitnessLevel: null,
    workoutPlan: null,
    equipment: [],
    // Meal planning
    mealPlanComplete: false,
    mealPlan: null,
    dietaryPreferences: null,
    // Progress & Engagement
    week: 3,
    startDate: '2024-12-01',
    currentStreak: 12,
    longestStreak: 14,
    totalPoints: 2450,
    level: 'Silver',
    badges: ['first_workout', 'protein_champion', 'hydration_hero', '7_day_streak'],
    weightLog: [
      { date: '2024-12-01', weight: 185 },
      { date: '2024-12-08', weight: 183.5 },
      { date: '2024-12-15', weight: 181.2 },
      { date: '2024-12-22', weight: 179.8 },
    ],
    // Daily goals
    waterGoal: 64,
    waterCurrent: 48,
    proteinGoal: 100,
    proteinCurrent: 65,
    fiberGoal: 25,
    fiberCurrent: 12,
    exerciseGoal: 30,
    exerciseCurrent: 20,
    // Weekly history
    weeklyHistory: [
      { week: 1, protein: 85, water: 90, exercise: 70, meals: 95 },
      { week: 2, protein: 92, water: 88, exercise: 80, meals: 90 },
      { week: 3, protein: 78, water: 95, exercise: 65, meals: 88 },
    ],
    // Provider notes
    providerNotes: [],
    nextAppointment: '2025-01-25',
    medicationDose: '0.5mg',
    medicationSchedule: 'Weekly - Sundays',
  });
  const [activeModal, setActiveModal] = useState(null);

  // Mock patients for provider view
  const [patients] = useState([
    { ...user },
    {
      id: 'patient_002',
      name: 'Michael R.',
      email: 'michael@email.com',
      week: 6,
      currentStreak: 8,
      weightLog: [
        { date: '2024-11-15', weight: 220 },
        { date: '2024-11-22', weight: 217 },
        { date: '2024-11-29', weight: 214.5 },
        { date: '2024-12-06', weight: 212 },
        { date: '2024-12-13', weight: 210.2 },
        { date: '2024-12-20', weight: 208.5 },
      ],
      proteinCurrent: 85,
      proteinGoal: 120,
      waterCurrent: 56,
      waterGoal: 80,
      exerciseCurrent: 45,
      exerciseGoal: 45,
      fitnessLevel: 'intermediate',
      weeklyHistory: [
        { week: 4, protein: 90, water: 85, exercise: 95, meals: 88 },
        { week: 5, protein: 88, water: 82, exercise: 100, meals: 92 },
        { week: 6, protein: 71, water: 70, exercise: 100, meals: 75 },
      ],
      alerts: ['Low protein intake this week', 'Missed 2 meal logs'],
      nextAppointment: '2025-01-20',
      medicationDose: '1.0mg',
    },
    {
      id: 'patient_003',
      name: 'Jennifer L.',
      email: 'jennifer@email.com',
      week: 2,
      currentStreak: 14,
      weightLog: [
        { date: '2024-12-15', weight: 165 },
        { date: '2024-12-22', weight: 163.2 },
      ],
      proteinCurrent: 92,
      proteinGoal: 90,
      waterCurrent: 64,
      waterGoal: 64,
      exerciseCurrent: 25,
      exerciseGoal: 30,
      fitnessLevel: 'beginner',
      weeklyHistory: [
        { week: 1, protein: 98, water: 100, exercise: 90, meals: 100 },
        { week: 2, protein: 102, water: 100, exercise: 83, meals: 95 },
      ],
      alerts: [],
      nextAppointment: '2025-01-28',
      medicationDose: '0.25mg',
    },
  ]);

  // Onboarding flow
  if (showOnboarding && appMode === 'patient') {
    return (
      <div style={styles.appContainer}>
        <style>{globalStyles}</style>
        <div style={styles.phoneFrame}>
          <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
        </div>
      </div>
    );
  }

  const patientScreens = {
    home: <HomeScreen user={user} setUser={setUser} setActiveModal={setActiveModal} />,
    nutrition: <NutritionScreen user={user} setUser={setUser} />,
    fitness: <FitnessScreen user={user} setUser={setUser} />,
    treatments: <TreatmentsScreen setActiveModal={setActiveModal} />,
    profile: <ProfileScreen user={user} setUser={setUser} />,
  };

  const providerScreens = {
    dashboard: <ProviderDashboard patients={patients} setCurrentScreen={setCurrentScreen} />,
    patients: <PatientListScreen patients={patients} setCurrentScreen={setCurrentScreen} />,
    messages: <MessagesScreen patients={patients} />,
    analytics: <AnalyticsScreen patients={patients} />,
    settings: <ProviderSettingsScreen />,
  };

  return (
    <div style={styles.appContainer}>
      <style>{globalStyles}</style>
      
      {/* Mode Toggle (for demo purposes) */}
      <div style={styles.modeToggle}>
        <button 
          style={{...styles.modeBtn, ...(appMode === 'patient' ? styles.modeBtnActive : {})}}
          onClick={() => { setAppMode('patient'); setCurrentScreen('home'); }}
        >
          👤 Patient View
        </button>
        <button 
          style={{...styles.modeBtn, ...(appMode === 'provider' ? styles.modeBtnActive : {})}}
          onClick={() => { setAppMode('provider'); setCurrentScreen('dashboard'); }}
        >
          🩺 Provider View
        </button>
      </div>
      
      <div style={styles.phoneFrame}>
        <div style={styles.screen}>
          {appMode === 'patient' ? patientScreens[currentScreen] : providerScreens[currentScreen]}
        </div>
        {appMode === 'patient' ? (
          <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
        ) : (
          <ProviderBottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
        )}
      </div>
      
      {activeModal && (
        <Modal activeModal={activeModal} setActiveModal={setActiveModal} />
      )}
    </div>
  );
}

// Global Styles
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: 'DM Sans', sans-serif;
    background: #FAF9F7;
  }
  
  .progress-ring {
    transition: stroke-dashoffset 0.5s ease;
  }
  
  .card-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.08);
  }
  
  .fade-in {
    animation: fadeIn 0.4s ease forwards;
  }
  
  .slide-up {
    animation: slideUp 0.5s ease forwards;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }
  
  @keyframes scanning {
    0% { top: 0; }
    50% { top: calc(100% - 4px); }
    100% { top: 0; }
  }
  
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes confetti {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
  }
  
  .pulse {
    animation: pulse 2s ease-in-out infinite;
  }
  
  .scanning-line {
    animation: scanning 2s ease-in-out infinite;
  }
  
  .breathe {
    animation: breathe 4s ease-in-out infinite;
  }
  
  .nav-item {
    transition: all 0.2s ease;
  }
  
  .nav-item:hover {
    transform: scale(1.05);
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #3B7D3B 0%, #5B7B50 100%);
    transition: all 0.3s ease;
  }
  
  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(74, 103, 65, 0.3);
  }
  
  .progress-bar-fill {
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
  
  video {
    transform: scaleX(-1);
  }
`;

// ==================== ONBOARDING FLOW ====================
function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: '🌟',
      title: 'Welcome to HYDR801',
      subtitle: 'Your personalized GLP-1 wellness companion',
      description: 'We\'ll help you maximize your weight loss journey with AI-powered nutrition, fitness plans, and progress tracking.',
      image: (
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
          <circle cx="100" cy="80" r="60" fill="#E8EDE6"/>
          <circle cx="100" cy="80" r="45" fill="#F5F7F4"/>
          <path d="M85 70C85 70 90 90 100 90C110 90 115 70 115 70" stroke="#3B7D3B" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="85" cy="65" r="5" fill="#3B7D3B"/>
          <circle cx="115" cy="65" r="5" fill="#3B7D3B"/>
          <circle cx="70" cy="50" r="8" fill="#C4956A" opacity="0.6"/>
          <circle cx="130" cy="50" r="8" fill="#26A69A" opacity="0.6"/>
          <circle cx="100" cy="130" r="10" fill="#9B7E9B" opacity="0.6"/>
        </svg>
      )
    },
    {
      icon: '🍽️',
      title: 'Personalized Nutrition',
      subtitle: 'AI-powered meal plans for GLP-1 success',
      description: 'Get high-protein meal plans optimized for your medication, dietary preferences, and lifestyle.',
      image: (
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
          <circle cx="100" cy="80" r="50" fill="#E8EDE6"/>
          <circle cx="70" cy="70" r="15" fill="#3B7D3B"/>
          <circle cx="130" cy="70" r="15" fill="#C4956A"/>
          <circle cx="100" cy="100" r="18" fill="#26A69A"/>
          <text x="70" y="75" textAnchor="middle" fill="white" fontSize="14">🥩</text>
          <text x="130" y="75" textAnchor="middle" fill="white" fontSize="14">🥬</text>
          <text x="100" y="105" textAnchor="middle" fill="white" fontSize="16">💧</text>
        </svg>
      )
    },
    {
      icon: '💪',
      title: 'Smart Fitness Assessment',
      subtitle: 'Camera-powered exercise analysis',
      description: 'Our AI analyzes your movements to create workouts perfect for your fitness level and available equipment.',
      image: (
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
          <rect x="60" y="30" width="80" height="100" rx="10" fill="#2D2D2D"/>
          <rect x="65" y="35" width="70" height="85" rx="5" fill="#3D3D4D"/>
          <circle cx="100" cy="75" r="25" stroke="#3B7D3B" strokeWidth="2" strokeDasharray="5 3"/>
          <circle cx="100" cy="65" r="8" fill="#3B7D3B"/>
          <path d="M90 85L100 75L110 85" stroke="#3B7D3B" strokeWidth="2"/>
          <path d="M85 95L100 105L115 95" stroke="#3B7D3B" strokeWidth="2"/>
        </svg>
      )
    },
    {
      icon: '📊',
      title: 'Track Your Progress',
      subtitle: 'See how far you\'ve come',
      description: 'Log meals, workouts, and weight. Earn badges, maintain streaks, and watch your transformation unfold.',
      image: (
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
          <rect x="50" y="100" width="20" height="40" fill="#E8EDE6" rx="4"/>
          <rect x="80" y="80" width="20" height="60" fill="#C4956A" rx="4"/>
          <rect x="110" y="60" width="20" height="80" fill="#26A69A" rx="4"/>
          <rect x="140" y="40" width="20" height="100" fill="#3B7D3B" rx="4"/>
          <path d="M50 90L80 70L110 50L150 30" stroke="#3B7D3B" strokeWidth="2" strokeDasharray="4 2"/>
          <circle cx="150" cy="30" r="6" fill="#3B7D3B"/>
        </svg>
      )
    },
    {
      icon: '🤝',
      title: 'Connected Care',
      subtitle: 'Your provider sees your progress',
      description: 'Your healthcare team can monitor your journey and provide personalized guidance along the way.',
      image: (
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
          <circle cx="70" cy="70" r="30" fill="#E8EDE6"/>
          <circle cx="130" cy="70" r="30" fill="#E8EDE6"/>
          <circle cx="70" cy="60" r="12" fill="#3B7D3B"/>
          <path d="M58 85C58 78 63 75 70 75C77 75 82 78 82 85" stroke="#3B7D3B" strokeWidth="2"/>
          <circle cx="130" cy="60" r="12" fill="#26A69A"/>
          <path d="M118 85C118 78 123 75 130 75C137 75 142 78 142 85" stroke="#26A69A" strokeWidth="2"/>
          <path d="M95 70H105" stroke="#3B7D3B" strokeWidth="2" strokeLinecap="round"/>
          <path d="M100 65V75" stroke="#3B7D3B" strokeWidth="2" strokeLinecap="round"/>
          <text x="70" y="120" textAnchor="middle" fill="#6B6B6B" fontSize="10">You</text>
          <text x="130" y="120" textAnchor="middle" fill="#6B6B6B" fontSize="10">Provider</text>
        </svg>
      )
    }
  ];

  const currentStep = steps[step];

  return (
    <div style={styles.onboardingContainer} className="fade-in">
      {/* Progress dots */}
      <div style={styles.onboardingProgress}>
        {steps.map((_, idx) => (
          <div 
            key={idx} 
            style={{
              ...styles.onboardingDot,
              ...(idx <= step ? styles.onboardingDotActive : {})
            }} 
          />
        ))}
      </div>

      {/* Skip button */}
      {step < steps.length - 1 && (
        <button style={styles.skipButton} onClick={onComplete}>Skip</button>
      )}

      {/* Content */}
      <div style={styles.onboardingContent}>
        <div style={styles.onboardingImage}>
          {currentStep.image}
        </div>
        
        <span style={styles.onboardingIcon}>{currentStep.icon}</span>
        <h1 style={styles.onboardingTitle}>{currentStep.title}</h1>
        <p style={styles.onboardingSubtitle}>{currentStep.subtitle}</p>
        <p style={styles.onboardingDesc}>{currentStep.description}</p>
      </div>

      {/* Navigation */}
      <div style={styles.onboardingNav}>
        {step === steps.length - 1 ? (
          <button style={styles.primaryButton} className="btn-primary" onClick={onComplete}>
            Get Started
          </button>
        ) : (
          <button style={styles.primaryButton} className="btn-primary" onClick={() => setStep(step + 1)}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

// ==================== PROVIDER DASHBOARD ====================
function ProviderDashboard({ patients, setCurrentScreen }) {
  const alerts = patients.flatMap(p => (p.alerts || []).map(a => ({ patient: p.name, alert: a })));
  const todayAppointments = patients.filter(p => p.nextAppointment === '2025-01-20');

  const avgCompliance = Math.round(
    patients.reduce((sum, p) => {
      const lastWeek = p.weeklyHistory?.[p.weeklyHistory.length - 1];
      if (lastWeek) {
        return sum + (lastWeek.protein + lastWeek.water + lastWeek.exercise + lastWeek.meals) / 4;
      }
      return sum;
    }, 0) / patients.length
  );

  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.providerHeader}>
        <div>
          <p style={styles.greeting}>Good morning,</p>
          <h1 style={styles.providerName}>Dr. Williams</h1>
        </div>
        <div style={styles.providerAvatar}>👩‍⚕️</div>
      </header>

      {/* Quick Stats */}
      <div style={styles.providerStatsRow}>
        <div style={styles.providerStat}>
          <span style={styles.providerStatValue}>{patients.length}</span>
          <span style={styles.providerStatLabel}>Active Patients</span>
        </div>
        <div style={styles.providerStat}>
          <span style={styles.providerStatValue}>{avgCompliance}%</span>
          <span style={styles.providerStatLabel}>Avg Compliance</span>
        </div>
        <div style={styles.providerStat}>
          <span style={styles.providerStatValue}>{alerts.length}</span>
          <span style={styles.providerStatLabel}>Alerts</span>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>⚠️ Patient Alerts</h3>
          <div style={styles.alertsList}>
            {alerts.map((alert, idx) => (
              <div key={idx} style={styles.alertCard}>
                <div style={styles.alertIcon}>!</div>
                <div style={styles.alertContent}>
                  <p style={styles.alertPatient}>{alert.patient}</p>
                  <p style={styles.alertText}>{alert.alert}</p>
                </div>
                <button style={styles.alertAction}>View</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Today's Schedule */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>📅 Today's Appointments</h3>
        {todayAppointments.length > 0 ? (
          <div style={styles.appointmentsList}>
            {todayAppointments.map((patient, idx) => (
              <div key={idx} style={styles.appointmentCard}>
                <div style={styles.appointmentTime}>10:00 AM</div>
                <div style={styles.appointmentInfo}>
                  <p style={styles.appointmentName}>{patient.name}</p>
                  <p style={styles.appointmentType}>Week {patient.week} Check-in</p>
                </div>
                <button style={styles.appointmentBtn}>Prep</button>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.noAppointments}>No appointments scheduled for today</p>
        )}
      </section>

      {/* Patient Overview */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>👥 Recent Patient Activity</h3>
          <button style={styles.viewAllBtn} onClick={() => setCurrentScreen('patients')}>View All</button>
        </div>
        <div style={styles.patientMiniList}>
          {patients.slice(0, 3).map((patient, idx) => (
            <PatientMiniCard key={idx} patient={patient} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.quickActionsGrid}>
          <div style={styles.quickActionCard}>
            <span style={styles.qaIcon}>📨</span>
            <span style={styles.qaLabel}>Send Reminder</span>
          </div>
          <div style={styles.quickActionCard}>
            <span style={styles.qaIcon}>📊</span>
            <span style={styles.qaLabel}>View Reports</span>
          </div>
          <div style={styles.quickActionCard}>
            <span style={styles.qaIcon}>💊</span>
            <span style={styles.qaLabel}>Adjust Dose</span>
          </div>
          <div style={styles.quickActionCard}>
            <span style={styles.qaIcon}>📝</span>
            <span style={styles.qaLabel}>Add Note</span>
          </div>
        </div>
      </section>
    </div>
  );
}

// Patient Mini Card for Dashboard
function PatientMiniCard({ patient }) {
  const lastWeek = patient.weeklyHistory?.[patient.weeklyHistory.length - 1];
  const compliance = lastWeek 
    ? Math.round((lastWeek.protein + lastWeek.water + lastWeek.exercise + lastWeek.meals) / 4)
    : 0;
  
  const weightLoss = patient.weightLog?.length >= 2
    ? (patient.weightLog[0].weight - patient.weightLog[patient.weightLog.length - 1].weight).toFixed(1)
    : 0;

  return (
    <div style={styles.patientMiniCard} className="card-hover">
      <div style={styles.pmcHeader}>
        <div style={styles.pmcAvatar}>{patient.name[0]}</div>
        <div style={styles.pmcInfo}>
          <p style={styles.pmcName}>{patient.name}</p>
          <p style={styles.pmcWeek}>Week {patient.week}</p>
        </div>
        {patient.alerts?.length > 0 && (
          <div style={styles.pmcAlertBadge}>{patient.alerts.length}</div>
        )}
      </div>
      <div style={styles.pmcStats}>
        <div style={styles.pmcStatItem}>
          <span style={styles.pmcStatValue}>{weightLoss} lbs</span>
          <span style={styles.pmcStatLabel}>Lost</span>
        </div>
        <div style={styles.pmcStatItem}>
          <span style={{...styles.pmcStatValue, color: compliance >= 80 ? '#3B7D3B' : '#C4956A'}}>{compliance}%</span>
          <span style={styles.pmcStatLabel}>Compliance</span>
        </div>
        <div style={styles.pmcStatItem}>
          <span style={styles.pmcStatValue}>{patient.currentStreak}</span>
          <span style={styles.pmcStatLabel}>Streak</span>
        </div>
      </div>
    </div>
  );
}

// Patient List Screen
function PatientListScreen({ patients, setCurrentScreen }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedPatient) {
    return (
      <PatientDetailScreen 
        patient={selectedPatient} 
        onBack={() => setSelectedPatient(null)} 
      />
    );
  }

  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Patients</h1>
        <p style={styles.pageSubtitle}>{patients.length} active patients</p>
      </header>

      <div style={styles.searchBar}>
        <span style={styles.searchIcon}>🔍</span>
        <input 
          type="text"
          placeholder="Search patients..."
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={styles.patientList}>
        {filteredPatients.map((patient, idx) => {
          const lastWeek = patient.weeklyHistory?.[patient.weeklyHistory.length - 1];
          const compliance = lastWeek 
            ? Math.round((lastWeek.protein + lastWeek.water + lastWeek.exercise + lastWeek.meals) / 4)
            : 0;

          return (
            <div 
              key={idx} 
              style={styles.patientListCard} 
              className="card-hover"
              onClick={() => setSelectedPatient(patient)}
            >
              <div style={styles.plcAvatar}>{patient.name[0]}</div>
              <div style={styles.plcInfo}>
                <p style={styles.plcName}>{patient.name}</p>
                <p style={styles.plcMeta}>Week {patient.week} · {patient.medicationDose}</p>
              </div>
              <div style={styles.plcRight}>
                <div style={{
                  ...styles.plcCompliance,
                  background: compliance >= 80 ? '#E8EDE6' : '#FFF5F0',
                  color: compliance >= 80 ? '#3B7D3B' : '#C4956A'
                }}>
                  {compliance}%
                </div>
                {patient.alerts?.length > 0 && (
                  <span style={styles.plcAlert}>⚠️</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Patient Detail Screen
function PatientDetailScreen({ patient, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const weightLoss = patient.weightLog?.length >= 2
    ? (patient.weightLog[0].weight - patient.weightLog[patient.weightLog.length - 1].weight).toFixed(1)
    : 0;

  return (
    <div style={styles.screenContent} className="fade-in">
      <div style={styles.patientDetailHeader}>
        <button style={styles.backButton} onClick={onBack}>← Back</button>
      </div>

      <div style={styles.patientProfile}>
        <div style={styles.pdAvatar}>{patient.name[0]}</div>
        <h2 style={styles.pdName}>{patient.name}</h2>
        <p style={styles.pdMeta}>Week {patient.week} · {patient.medicationDose} weekly</p>
        
        {patient.alerts?.length > 0 && (
          <div style={styles.pdAlerts}>
            {patient.alerts.map((alert, idx) => (
              <div key={idx} style={styles.pdAlertItem}>⚠️ {alert}</div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={styles.pdTabs}>
        {['overview', 'nutrition', 'fitness', 'weight'].map(tab => (
          <button
            key={tab}
            style={{...styles.pdTab, ...(activeTab === tab ? styles.pdTabActive : {})}}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="fade-in">
          {/* Key Metrics */}
          <div style={styles.pdMetricsGrid}>
            <div style={styles.pdMetricCard}>
              <span style={styles.pdMetricValue}>{weightLoss} lbs</span>
              <span style={styles.pdMetricLabel}>Total Lost</span>
            </div>
            <div style={styles.pdMetricCard}>
              <span style={styles.pdMetricValue}>{patient.currentStreak}</span>
              <span style={styles.pdMetricLabel}>Day Streak</span>
            </div>
            <div style={styles.pdMetricCard}>
              <span style={styles.pdMetricValue}>{Math.round((patient.proteinCurrent / patient.proteinGoal) * 100)}%</span>
              <span style={styles.pdMetricLabel}>Protein Today</span>
            </div>
            <div style={styles.pdMetricCard}>
              <span style={styles.pdMetricValue}>{Math.round((patient.exerciseCurrent / patient.exerciseGoal) * 100)}%</span>
              <span style={styles.pdMetricLabel}>Exercise Today</span>
            </div>
          </div>

          {/* Weekly Compliance Chart */}
          <div style={styles.pdChartCard}>
            <h4 style={styles.pdChartTitle}>Weekly Compliance Trend</h4>
            <div style={styles.pdChart}>
              {patient.weeklyHistory?.map((week, idx) => {
                const avg = Math.round((week.protein + week.water + week.exercise + week.meals) / 4);
                return (
                  <div key={idx} style={styles.pdChartBar}>
                    <div style={{
                      ...styles.pdChartBarFill,
                      height: `${avg}%`,
                      background: avg >= 80 ? '#3B7D3B' : avg >= 60 ? '#C4956A' : '#E57373'
                    }} />
                    <span style={styles.pdChartLabel}>W{week.week}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={styles.pdActions}>
            <button style={styles.pdActionBtn}>📨 Send Message</button>
            <button style={styles.pdActionBtn}>📝 Add Note</button>
            <button style={styles.pdActionBtn}>💊 Adjust Dose</button>
          </div>
        </div>
      )}

      {activeTab === 'weight' && (
        <div className="fade-in">
          <div style={styles.pdWeightChart}>
            <h4 style={styles.pdChartTitle}>Weight Progress</h4>
            <div style={styles.weightChartContainer}>
              {patient.weightLog?.map((entry, idx) => {
                const maxWeight = Math.max(...patient.weightLog.map(e => e.weight));
                const minWeight = Math.min(...patient.weightLog.map(e => e.weight));
                const range = maxWeight - minWeight || 1;
                const height = ((entry.weight - minWeight) / range) * 80 + 20;
                
                return (
                  <div key={idx} style={styles.weightPoint}>
                    <div style={{...styles.weightBar, height: `${100 - height}%`}} />
                    <div style={styles.weightValue}>{entry.weight}</div>
                    <div style={styles.weightDate}>{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'nutrition' && (
        <div className="fade-in">
          <div style={styles.pdNutritionStats}>
            <div style={styles.nutritionStatCard}>
              <div style={styles.nutritionStatHeader}>
                <span>Protein</span>
                <span style={styles.nutritionPercent}>{Math.round((patient.proteinCurrent / patient.proteinGoal) * 100)}%</span>
              </div>
              <div style={styles.nutritionBar}>
                <div style={{...styles.nutritionBarFill, width: `${(patient.proteinCurrent / patient.proteinGoal) * 100}%`, background: '#3B7D3B'}} />
              </div>
              <p style={styles.nutritionMeta}>{patient.proteinCurrent}g / {patient.proteinGoal}g today</p>
            </div>
            
            <div style={styles.nutritionStatCard}>
              <div style={styles.nutritionStatHeader}>
                <span>Hydration</span>
                <span style={styles.nutritionPercent}>{Math.round((patient.waterCurrent / patient.waterGoal) * 100)}%</span>
              </div>
              <div style={styles.nutritionBar}>
                <div style={{...styles.nutritionBarFill, width: `${(patient.waterCurrent / patient.waterGoal) * 100}%`, background: '#26A69A'}} />
              </div>
              <p style={styles.nutritionMeta}>{patient.waterCurrent}oz / {patient.waterGoal}oz today</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fitness' && (
        <div className="fade-in">
          <div style={styles.pdFitnessInfo}>
            <div style={styles.fitnessInfoCard}>
              <span style={styles.fitnessInfoLabel}>Fitness Level</span>
              <span style={styles.fitnessInfoValue}>{patient.fitnessLevel || 'Not assessed'}</span>
            </div>
            <div style={styles.fitnessInfoCard}>
              <span style={styles.fitnessInfoLabel}>Exercise Today</span>
              <span style={styles.fitnessInfoValue}>{patient.exerciseCurrent} / {patient.exerciseGoal} min</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Messages Screen
function MessagesScreen({ patients }) {
  const conversations = patients.map(p => ({
    patient: p,
    lastMessage: 'Thanks for the meal plan update!',
    time: '2h ago',
    unread: Math.random() > 0.7
  }));

  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Messages</h1>
        <p style={styles.pageSubtitle}>Patient communications</p>
      </header>

      <div style={styles.messagesList}>
        {conversations.map((conv, idx) => (
          <div key={idx} style={styles.messageCard} className="card-hover">
            <div style={styles.msgAvatar}>{conv.patient.name[0]}</div>
            <div style={styles.msgContent}>
              <div style={styles.msgHeader}>
                <span style={styles.msgName}>{conv.patient.name}</span>
                <span style={styles.msgTime}>{conv.time}</span>
              </div>
              <p style={styles.msgPreview}>{conv.lastMessage}</p>
            </div>
            {conv.unread && <div style={styles.msgUnread} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// Analytics Screen
function AnalyticsScreen({ patients }) {
  const totalWeightLoss = patients.reduce((sum, p) => {
    if (p.weightLog?.length >= 2) {
      return sum + (p.weightLog[0].weight - p.weightLog[p.weightLog.length - 1].weight);
    }
    return sum;
  }, 0);

  const avgStreak = Math.round(patients.reduce((sum, p) => sum + (p.currentStreak || 0), 0) / patients.length);

  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Analytics</h1>
        <p style={styles.pageSubtitle}>Practice overview</p>
      </header>

      <div style={styles.analyticsGrid}>
        <div style={styles.analyticsCard}>
          <span style={styles.analyticsValue}>{totalWeightLoss.toFixed(1)}</span>
          <span style={styles.analyticsLabel}>Total lbs Lost</span>
          <span style={styles.analyticsSubtext}>All patients combined</span>
        </div>
        <div style={styles.analyticsCard}>
          <span style={styles.analyticsValue}>{avgStreak}</span>
          <span style={styles.analyticsLabel}>Avg Day Streak</span>
          <span style={styles.analyticsSubtext}>Patient engagement</span>
        </div>
        <div style={styles.analyticsCard}>
          <span style={styles.analyticsValue}>87%</span>
          <span style={styles.analyticsLabel}>Retention Rate</span>
          <span style={styles.analyticsSubtext}>Past 90 days</span>
        </div>
        <div style={styles.analyticsCard}>
          <span style={styles.analyticsValue}>4.8</span>
          <span style={styles.analyticsLabel}>Avg Rating</span>
          <span style={styles.analyticsSubtext}>Patient satisfaction</span>
        </div>
      </div>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Compliance by Category</h3>
        <div style={styles.complianceBreakdown}>
          {[
            { label: 'Protein Goals', value: 85, color: '#3B7D3B' },
            { label: 'Hydration', value: 78, color: '#26A69A' },
            { label: 'Exercise', value: 72, color: '#9B7E9B' },
            { label: 'Meal Logging', value: 91, color: '#C4956A' },
          ].map((item, idx) => (
            <div key={idx} style={styles.complianceItem}>
              <div style={styles.complianceHeader}>
                <span style={styles.complianceLabel}>{item.label}</span>
                <span style={styles.complianceValue}>{item.value}%</span>
              </div>
              <div style={styles.complianceBar}>
                <div style={{...styles.complianceBarFill, width: `${item.value}%`, background: item.color}} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Provider Settings Screen
function ProviderSettingsScreen() {
  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Settings</h1>
        <p style={styles.pageSubtitle}>Provider preferences</p>
      </header>

      <div style={styles.settingsList}>
        {[
          { icon: '👤', label: 'Account Settings' },
          { icon: '🔔', label: 'Notification Preferences' },
          { icon: '📊', label: 'Default Patient Goals' },
          { icon: '📝', label: 'Note Templates' },
          { icon: '🔗', label: 'EHR Integration' },
          { icon: '👥', label: 'Team Members' },
          { icon: '❓', label: 'Help & Support' },
        ].map((item, idx) => (
          <div key={idx} style={styles.settingItem} className="card-hover">
            <span style={styles.settingIcon}>{item.icon}</span>
            <span style={styles.settingLabel}>{item.label}</span>
            <span style={styles.settingArrow}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Provider Bottom Nav
function ProviderBottomNav({ currentScreen, setCurrentScreen }) {
  const items = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'patients', icon: '👥', label: 'Patients' },
    { id: 'messages', icon: '💬', label: 'Messages' },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <nav style={styles.bottomNav}>
      {items.map(item => (
        <button
          key={item.id}
          style={{
            ...styles.navButton,
            color: currentScreen === item.id ? '#3B7D3B' : '#9B9B9B'
          }}
          onClick={() => setCurrentScreen(item.id)}
          className="nav-item"
        >
          <span style={{fontSize: '20px'}}>{item.icon}</span>
          <span style={styles.navLabel}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

// Home Screen
function HomeScreen({ user, setUser, setActiveModal }) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={styles.screenContent} className="fade-in">
      {/* HYDR801 Logo Header */}
      <div style={styles.brandHeader}>
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
          {/* Leaves */}
          <path d="M50 20 C35 25, 25 40, 30 55 C35 45, 45 38, 50 35 C55 38, 65 45, 70 55 C75 40, 65 25, 50 20Z" fill="#3B7D3B"/>
          <path d="M30 55 C20 60, 15 75, 25 85 C30 75, 40 68, 50 65 C40 62, 32 58, 30 55Z" fill="#4CAF50"/>
          <path d="M70 55 C80 60, 85 75, 75 85 C70 75, 60 68, 50 65 C60 62, 68 58, 70 55Z" fill="#4CAF50"/>
          {/* Center H */}
          <text x="50" y="58" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#26A69A">H</text>
        </svg>
        <span style={styles.brandName}>HYDR801</span>
      </div>

      <header style={styles.header}>
        <div>
          <p style={styles.greeting}>{greeting()},</p>
          <h1 style={styles.userName}>{user.name}</h1>
        </div>
        <div style={styles.weekBadge}>
          <span style={styles.weekLabel}>Week</span>
          <span style={styles.weekNumber}>{user.week}</span>
        </div>
      </header>

      <div style={styles.heroCard} className="slide-up">
        <div style={styles.heroContent}>
          <p style={styles.heroSubtitle}>Today's Focus</p>
          <h2 style={styles.heroTitle}>Prioritize Protein</h2>
          <p style={styles.heroText}>
            Aim for 25-30g protein at each meal to preserve muscle mass and support your metabolism.
          </p>
        </div>
        <div style={styles.heroImagePlaceholder}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="35" fill="#E8F5E9"/>
            <path d="M40 20 C28 24, 20 36, 24 48 C28 40, 36 34, 40 32 C44 34, 52 40, 56 48 C60 36, 52 24, 40 20Z" fill="#3B7D3B"/>
            <path d="M24 48 C16 52, 12 64, 20 72 C24 64, 32 58, 40 56 C32 54, 26 50, 24 48Z" fill="#4CAF50"/>
            <path d="M56 48 C64 52, 68 64, 60 72 C56 64, 48 58, 40 56 C48 54, 54 50, 56 48Z" fill="#4CAF50"/>
          </svg>
        </div>
      </div>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Daily Goals</h3>
        <div style={styles.goalsGrid}>
          <GoalCard
            icon={<WaterIcon />}
            label="Hydration"
            current={user.waterCurrent}
            goal={user.waterGoal}
            unit="oz"
            color="#26A69A"
            onIncrement={() => setUser({...user, waterCurrent: Math.min(user.waterCurrent + 8, user.waterGoal)})}
          />
          <GoalCard
            icon={<ProteinIcon />}
            label="Protein"
            current={user.proteinCurrent}
            goal={user.proteinGoal}
            unit="g"
            color="#3B7D3B"
            onIncrement={() => setUser({...user, proteinCurrent: Math.min(user.proteinCurrent + 10, user.proteinGoal)})}
          />
          <GoalCard
            icon={<FiberIcon />}
            label="Fiber"
            current={user.fiberCurrent}
            goal={user.fiberGoal}
            unit="g"
            color="#C4956A"
            onIncrement={() => setUser({...user, fiberCurrent: Math.min(user.fiberCurrent + 5, user.fiberGoal)})}
          />
          <GoalCard
            icon={<ExerciseIcon />}
            label="Movement"
            current={user.exerciseCurrent}
            goal={user.exerciseGoal}
            unit="min"
            color="#9B7E9B"
            onIncrement={() => setUser({...user, exerciseCurrent: Math.min(user.exerciseCurrent + 10, user.exerciseGoal)})}
          />
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Optimize Your Journey</h3>
        <div style={styles.treatmentPreview} className="card-hover" onClick={() => setActiveModal('physique-boost')}>
          <div style={styles.treatmentPreviewContent}>
            <span style={styles.treatmentTag}>Complement Your GLP-1</span>
            <h4 style={styles.treatmentPreviewTitle}>Physique Boost IV</h4>
            <p style={styles.treatmentPreviewText}>Rev up your fat-burning with our $199 IV</p>
          </div>
          <div style={styles.treatmentArrow}>→</div>
        </div>
        <div style={{...styles.treatmentPreview, marginTop: '10px'}} className="card-hover" onClick={() => setActiveModal('lipo-c')}>
          <div style={styles.treatmentPreviewContent}>
            <span style={styles.treatmentTag}>Popular Add-On</span>
            <h4 style={styles.treatmentPreviewTitle}>Lipo-C Injections</h4>
            <p style={styles.treatmentPreviewText}>Support fat metabolism • $20/month</p>
          </div>
          <div style={styles.treatmentArrow}>→</div>
        </div>
      </section>
    </div>
  );
}

// Goal Card Component
function GoalCard({ icon, label, current, goal, unit, color, onIncrement }) {
  const percentage = Math.round((current / goal) * 100);
  
  return (
    <div style={styles.goalCard} className="card-hover" onClick={onIncrement}>
      <div style={styles.goalHeader}>
        <div style={{...styles.goalIcon, backgroundColor: `${color}15`}}>
          {React.cloneElement(icon, { color })}
        </div>
        <span style={{...styles.goalPercentage, color}}>{percentage}%</span>
      </div>
      <div style={styles.goalProgress}>
        <div style={styles.progressBar}>
          <div 
            className="progress-bar-fill"
            style={{
              ...styles.progressFill,
              width: `${percentage}%`,
              backgroundColor: color
            }}
          />
        </div>
      </div>
      <p style={styles.goalLabel}>{label}</p>
      <p style={styles.goalValue}>{current}<span style={styles.goalUnit}>/{goal}{unit}</span></p>
    </div>
  );
}

// Nutrition Screen
function NutritionScreen({ user, setUser }) {
  const [showMealPlanner, setShowMealPlanner] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  const tips = [
    { icon: '🥚', title: 'Protein First', desc: 'Start each meal with protein to feel satisfied longer' },
    { icon: '💧', title: 'Hydrate Mindfully', desc: 'GLP-1s can reduce thirst—set reminders to drink water' },
    { icon: '🥬', title: 'Fiber for Fullness', desc: 'Add vegetables to every meal for nutrients and satiety' },
  ];

  const days = ['Today', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Show meal planner setup if no meal plan exists
  if (!user.mealPlanComplete && showMealPlanner) {
    return (
      <MealPlanSetup 
        user={user}
        onComplete={(preferences, mealPlan) => {
          setUser({
            ...user,
            mealPlanComplete: true,
            dietaryPreferences: preferences,
            mealPlan: mealPlan
          });
          setShowMealPlanner(false);
        }}
        onCancel={() => setShowMealPlanner(false)}
      />
    );
  }

  // Show meal plan prompt if no plan exists
  if (!user.mealPlanComplete) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <header style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Nutrition</h1>
          <p style={styles.pageSubtitle}>Your daily fuel tracker</p>
        </header>

        <div style={styles.macroOverview}>
          <MacroCircle label="Protein" current={user.proteinCurrent} goal={user.proteinGoal} color="#3B7D3B" />
          <MacroCircle label="Fiber" current={user.fiberCurrent} goal={user.fiberGoal} color="#C4956A" />
          <MacroCircle label="Water" current={user.waterCurrent} goal={user.waterGoal} color="#26A69A" unit="oz" />
        </div>

        <div style={styles.mealPlanPrompt}>
          <div style={styles.mealPlanBadge}>
            <span style={styles.mealPlanBadgeIcon}>✨</span>
            <span style={styles.mealPlanBadgeText}>AI-Powered</span>
          </div>
          
          <div style={styles.mealPlanIllustration}>
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="55" fill="#E8EDE6"/>
              <circle cx="60" cy="60" r="40" fill="#F5F7F4"/>
              <circle cx="45" cy="50" r="8" fill="#3B7D3B"/>
              <circle cx="75" cy="50" r="8" fill="#C4956A"/>
              <circle cx="60" cy="75" r="10" fill="#26A69A"/>
              <path d="M35 40L45 50L35 60" stroke="#3B7D3B" strokeWidth="2" strokeLinecap="round"/>
              <path d="M85 40L75 50L85 60" stroke="#C4956A" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          
          <h2 style={styles.mealPlanTitle}>Personalized Meal Plans</h2>
          <p style={styles.mealPlanDesc}>
            Get AI-generated meal plans optimized for GLP-1 success—high protein, 
            proper portions, and foods that work with your medication.
          </p>
          
          <div style={styles.mealPlanFeatures}>
            <div style={styles.mealPlanFeature}>
              <span style={styles.mpFeatureIcon}>🎯</span>
              <span style={styles.mpFeatureText}>Tailored to your preferences</span>
            </div>
            <div style={styles.mealPlanFeature}>
              <span style={styles.mpFeatureIcon}>🥗</span>
              <span style={styles.mpFeatureText}>GLP-1 optimized nutrition</span>
            </div>
            <div style={styles.mealPlanFeature}>
              <span style={styles.mpFeatureIcon}>📊</span>
              <span style={styles.mpFeatureText}>Macros calculated for you</span>
            </div>
          </div>
          
          <button style={styles.primaryButton} className="btn-primary" onClick={() => setShowMealPlanner(true)}>
            Create My Meal Plan
          </button>
        </div>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>GLP-1 Nutrition Tips</h3>
          <div style={styles.tipsContainer}>
            {tips.map((tip, idx) => (
              <div key={idx} style={styles.tipCard}>
                <span style={styles.tipIcon}>{tip.icon}</span>
                <div>
                  <h4 style={styles.tipTitle}>{tip.title}</h4>
                  <p style={styles.tipDesc}>{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Show meal plan
  const todayPlan = user.mealPlan?.weeklyPlan?.[selectedDay] || user.mealPlan?.weeklyPlan?.[0];
  const totalProtein = todayPlan?.meals?.reduce((sum, m) => sum + (m.protein || 0), 0) || 110;
  const totalCarbs = todayPlan?.meals?.reduce((sum, m) => sum + (m.carbs || 0), 0) || 95;
  const totalFat = todayPlan?.meals?.reduce((sum, m) => sum + (m.fat || 0), 0) || 45;
  const totalCalories = todayPlan?.meals?.reduce((sum, m) => sum + (m.calories || 0), 0) || 1250;

  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Nutrition</h1>
        <p style={styles.pageSubtitle}>Your personalized meal plan</p>
      </header>

      {/* Main Macros - Protein Emphasized */}
      <div style={styles.macroOverviewEnhanced}>
        {/* Protein - Large and centered */}
        <div style={styles.proteinHighlight}>
          <div style={styles.proteinCircleOuter}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="#E8EDE6" strokeWidth="12"/>
              <circle 
                cx="70" cy="70" r="60" fill="none" 
                stroke="#3B7D3B" strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${(user.proteinCurrent / user.proteinGoal) * 377} 377`}
                transform="rotate(-90 70 70)"
                className="progress-ring"
              />
            </svg>
            <div style={styles.proteinInner}>
              <span style={styles.proteinValue}>{user.proteinCurrent}</span>
              <span style={styles.proteinUnit}>g</span>
            </div>
          </div>
          <div style={styles.proteinLabel}>Protein</div>
          <div style={styles.proteinGoal}>Goal: {user.proteinGoal}g</div>
        </div>

        {/* Carbs and Fat - smaller, side by side */}
        <div style={styles.secondaryMacros}>
          <div style={styles.secondaryMacroCard}>
            <div style={styles.secondaryMacroCircle}>
              <svg width="70" height="70" viewBox="0 0 70 70">
                <circle cx="35" cy="35" r="28" fill="none" stroke="#F0EBE3" strokeWidth="6"/>
                <circle 
                  cx="35" cy="35" r="28" fill="none" 
                  stroke="#C4956A" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${(totalCarbs / 150) * 176} 176`}
                  transform="rotate(-90 35 35)"
                />
              </svg>
              <span style={styles.secondaryMacroValue}>{totalCarbs}</span>
            </div>
            <span style={styles.secondaryMacroLabel}>Carbs</span>
            <span style={styles.secondaryMacroGoal}>{totalCarbs}g / 150g</span>
          </div>
          
          <div style={styles.secondaryMacroCard}>
            <div style={styles.secondaryMacroCircle}>
              <svg width="70" height="70" viewBox="0 0 70 70">
                <circle cx="35" cy="35" r="28" fill="none" stroke="#E8F4F8" strokeWidth="6"/>
                <circle 
                  cx="35" cy="35" r="28" fill="none" 
                  stroke="#26A69A" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${(totalFat / 65) * 176} 176`}
                  transform="rotate(-90 35 35)"
                />
              </svg>
              <span style={styles.secondaryMacroValue}>{totalFat}</span>
            </div>
            <span style={styles.secondaryMacroLabel}>Fat</span>
            <span style={styles.secondaryMacroGoal}>{totalFat}g / 65g</span>
          </div>
        </div>
      </div>

      {/* Day selector */}
      <div style={styles.daySelector}>
        {days.map((day, idx) => (
          <button
            key={idx}
            style={{
              ...styles.daySelectorBtn,
              ...(selectedDay === idx ? styles.daySelectorBtnActive : {})
            }}
            onClick={() => setSelectedDay(idx)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Daily summary - Protein first and emphasized */}
      <div style={styles.dailySummaryEnhanced}>
        <div style={styles.summaryItemProtein}>
          <span style={styles.summaryValueProtein}>{totalProtein}g</span>
          <span style={styles.summaryLabelProtein}>PROTEIN</span>
        </div>
        <div style={styles.summaryDivider} />
        <div style={styles.summaryItem}>
          <span style={styles.summaryValue}>{totalCarbs}g</span>
          <span style={styles.summaryLabel}>CARBS</span>
        </div>
        <div style={styles.summaryDivider} />
        <div style={styles.summaryItem}>
          <span style={styles.summaryValue}>{totalFat}g</span>
          <span style={styles.summaryLabel}>FAT</span>
        </div>
        <div style={styles.summaryDivider} />
        <div style={styles.summaryItem}>
          <span style={styles.summaryValue}>{totalCalories}</span>
          <span style={styles.summaryLabel}>CALORIES</span>
        </div>
      </div>

      {/* Meals */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>{days[selectedDay]}'s Meals</h3>
        </div>
        <div style={styles.mealPlanList}>
          {todayPlan?.meals?.map((meal, idx) => (
            <MealCard key={idx} meal={meal} user={user} setUser={setUser} />
          ))}
        </div>
      </section>

      {/* Snack suggestions */}
      {todayPlan?.snacks && todayPlan.snacks.length > 0 && (
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Snack Ideas</h3>
          <div style={styles.snackList}>
            {todayPlan.snacks.map((snack, idx) => (
              <div key={idx} style={styles.snackCard}>
                <span style={styles.snackEmoji}>{snack.emoji || '🍎'}</span>
                <div style={styles.snackInfo}>
                  <p style={styles.snackName}>{snack.name}</p>
                  <p style={styles.snackMacros}>{snack.calories} cal · {snack.protein}g protein</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hydration reminder */}
      <div style={styles.hydrationReminder}>
        <span style={styles.hydrationIcon}>💧</span>
        <div style={styles.hydrationContent}>
          <p style={styles.hydrationTitle}>Hydration Reminder</p>
          <p style={styles.hydrationText}>{user.mealPlan?.hydrationTip || 'Drink water 30 minutes before meals to aid digestion'}</p>
        </div>
      </div>

      {/* Edit preferences button */}
      <button 
        style={styles.editPrefsButton}
        onClick={() => {
          setUser({...user, mealPlanComplete: false});
          setShowMealPlanner(true);
        }}
      >
        ✏️ Update Dietary Preferences
      </button>
    </div>
  );
}

// Meal Card Component
function MealCard({ meal, user, setUser }) {
  const [expanded, setExpanded] = useState(false);
  const [logged, setLogged] = useState(false);

  const handleLog = () => {
    setLogged(true);
    setUser({
      ...user,
      proteinCurrent: Math.min(user.proteinGoal, user.proteinCurrent + meal.protein),
      fiberCurrent: Math.min(user.fiberGoal, user.fiberCurrent + meal.fiber)
    });
  };

  return (
    <div style={styles.mealPlanCard} className="card-hover">
      <div style={styles.mealPlanCardHeader} onClick={() => setExpanded(!expanded)}>
        <div style={styles.mealTimeIcon}>
          {meal.type === 'breakfast' && '🌅'}
          {meal.type === 'lunch' && '☀️'}
          {meal.type === 'dinner' && '🌙'}
          {meal.type === 'snack' && '🍎'}
        </div>
        <div style={styles.mealPlanCardInfo}>
          <p style={styles.mealPlanType}>{meal.type?.charAt(0).toUpperCase() + meal.type?.slice(1)}</p>
          <h4 style={styles.mealPlanName}>{meal.name}</h4>
          <p style={styles.mealPlanMacros}>
            {meal.calories} cal · {meal.protein}g protein · {meal.fiber}g fiber
          </p>
        </div>
        <div style={styles.mealExpandIcon}>{expanded ? '−' : '+'}</div>
      </div>
      
      {expanded && (
        <div style={styles.mealPlanDetails}>
          {meal.description && (
            <p style={styles.mealDescription}>{meal.description}</p>
          )}
          
          {meal.ingredients && (
            <div style={styles.ingredientsList}>
              <p style={styles.ingredientsTitle}>Ingredients:</p>
              {meal.ingredients.map((ing, idx) => (
                <p key={idx} style={styles.ingredientItem}>• {ing}</p>
              ))}
            </div>
          )}
          
          {meal.instructions && (
            <div style={styles.instructionsList}>
              <p style={styles.instructionsTitle}>Quick Prep:</p>
              <p style={styles.instructionsText}>{meal.instructions}</p>
            </div>
          )}

          {meal.glp1Tip && (
            <div style={styles.glp1TipBox}>
              <span style={styles.glp1TipIcon}>💡</span>
              <p style={styles.glp1TipText}>{meal.glp1Tip}</p>
            </div>
          )}

          <button 
            style={{
              ...styles.logMealButton,
              ...(logged ? styles.logMealButtonLogged : {})
            }}
            onClick={handleLog}
            disabled={logged}
          >
            {logged ? '✓ Logged' : 'Log This Meal'}
          </button>
        </div>
      )}
    </div>
  );
}

// Meal Plan Setup Component
function MealPlanSetup({ user, onComplete, onCancel }) {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    dietType: null,
    allergies: [],
    dislikes: [],
    cuisines: [],
    cookingTime: null,
    mealsPerDay: 3,
    snacksPerDay: 1,
    calorieTarget: null,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const dietTypes = [
    { id: 'omnivore', name: 'Omnivore', icon: '🍖', desc: 'Eat everything' },
    { id: 'pescatarian', name: 'Pescatarian', icon: '🐟', desc: 'Fish & seafood, no meat' },
    { id: 'vegetarian', name: 'Vegetarian', icon: '🥬', desc: 'No meat or fish' },
    { id: 'vegan', name: 'Vegan', icon: '🌱', desc: 'No animal products' },
    { id: 'keto', name: 'Keto', icon: '🥑', desc: 'Very low carb' },
    { id: 'mediterranean', name: 'Mediterranean', icon: '🫒', desc: 'Heart-healthy focus' },
  ];

  const allergyOptions = [
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'gluten', name: 'Gluten', icon: '🌾' },
    { id: 'nuts', name: 'Tree Nuts', icon: '🥜' },
    { id: 'peanuts', name: 'Peanuts', icon: '🥜' },
    { id: 'eggs', name: 'Eggs', icon: '🥚' },
    { id: 'soy', name: 'Soy', icon: '🫘' },
    { id: 'shellfish', name: 'Shellfish', icon: '🦐' },
    { id: 'fish', name: 'Fish', icon: '🐟' },
  ];

  const cuisineOptions = [
    { id: 'american', name: 'American', icon: '🍔' },
    { id: 'mexican', name: 'Mexican', icon: '🌮' },
    { id: 'italian', name: 'Italian', icon: '🍝' },
    { id: 'asian', name: 'Asian', icon: '🍜' },
    { id: 'mediterranean', name: 'Mediterranean', icon: '🥙' },
    { id: 'indian', name: 'Indian', icon: '🍛' },
    { id: 'japanese', name: 'Japanese', icon: '🍱' },
    { id: 'thai', name: 'Thai', icon: '🍲' },
  ];

  const cookingTimeOptions = [
    { id: 'minimal', name: 'Minimal (< 15 min)', icon: '⚡' },
    { id: 'quick', name: 'Quick (15-30 min)', icon: '🕐' },
    { id: 'moderate', name: 'Moderate (30-45 min)', icon: '🕑' },
    { id: 'any', name: 'Any time is fine', icon: '👨‍🍳' },
  ];

  const toggleSelection = (array, item) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  const generateMealPlan = async () => {
    setIsGenerating(true);

    const prefsDescription = `
Diet Type: ${preferences.dietType || 'Omnivore'}
Allergies/Restrictions: ${preferences.allergies.length > 0 ? preferences.allergies.join(', ') : 'None'}
Food Dislikes: ${preferences.dislikes.length > 0 ? preferences.dislikes.join(', ') : 'None specified'}
Preferred Cuisines: ${preferences.cuisines.length > 0 ? preferences.cuisines.join(', ') : 'Any'}
Cooking Time Preference: ${preferences.cookingTime || 'Any'}
Meals Per Day: ${preferences.mealsPerDay}
Snacks Per Day: ${preferences.snacksPerDay}
    `.trim();

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: `You are a nutrition AI creating a personalized 7-day meal plan for a GLP-1 weight loss patient. This person is on medication like Ozempic, Wegovy, or Mounjaro.

Patient Dietary Preferences:
${prefsDescription}

CRITICAL GLP-1 NUTRITION REQUIREMENTS:
1. HIGH PROTEIN: 25-35g protein per meal minimum (crucial for muscle preservation during weight loss)
2. MODERATE FIBER: 25-30g daily total (helps with satiety but too much can cause GI issues with GLP-1)
3. SMALLER PORTIONS: GLP-1 reduces appetite, so portions should be satisfying but not overwhelming
4. HYDRATION FOCUS: Include water-rich foods; GLP-1 can reduce thirst sensation
5. AVOID: Greasy/fried foods, very high-fat meals, excessive sugar (can cause dumping syndrome)
6. PROTEIN FIRST: Structure meals to eat protein first, then vegetables, then carbs

Create a JSON response with this structure (respond ONLY with JSON, no markdown):
{
  "weeklyPlan": [
    {
      "day": "Monday",
      "meals": [
        {
          "type": "breakfast",
          "name": "Meal Name",
          "description": "Brief appetizing description",
          "calories": 350,
          "protein": 30,
          "carbs": 25,
          "fat": 12,
          "fiber": 6,
          "ingredients": ["ingredient 1 with amount", "ingredient 2 with amount"],
          "instructions": "Brief prep instructions (2-3 sentences)",
          "glp1Tip": "Specific tip for eating this meal on GLP-1",
          "prepTime": "15 min"
        }
      ],
      "snacks": [
        {
          "name": "Snack name",
          "emoji": "🍎",
          "calories": 150,
          "protein": 10,
          "description": "Brief description"
        }
      ],
      "dailyTotals": {
        "calories": 1400,
        "protein": 100,
        "fiber": 28
      }
    }
  ],
  "hydrationTip": "Personalized hydration advice for this person",
  "weeklyTips": ["tip 1 for success", "tip 2", "tip 3"],
  "groceryCategories": {
    "proteins": ["item1", "item2"],
    "produce": ["item1", "item2"],
    "dairy": ["item1", "item2"],
    "pantry": ["item1", "item2"]
  }
}

Make meals delicious, varied, and realistic to prepare. Include a mix of simple and slightly more elaborate options. Each day should have ${preferences.mealsPerDay} meals and ${preferences.snacksPerDay} snack options. Target 1200-1600 calories daily with at least 90-120g protein.`
          }]
        })
      });

      const data = await response.json();
      const planText = data.content.map(c => c.text || '').join('');
      
      let mealPlan;
      try {
        const cleanJson = planText.replace(/```json|```/g, '').trim();
        mealPlan = JSON.parse(cleanJson);
      } catch {
        mealPlan = getDefaultMealPlan(preferences);
      }

      onComplete(preferences, mealPlan);

    } catch (error) {
      console.error('Meal plan generation error:', error);
      onComplete(preferences, getDefaultMealPlan(preferences));
    }
  };

  const getDefaultMealPlan = (prefs) => ({
    weeklyPlan: [
      {
        day: 'Monday',
        meals: [
          {
            type: 'breakfast',
            name: 'Greek Yogurt Protein Bowl',
            description: 'Creamy Greek yogurt topped with berries and a sprinkle of nuts',
            calories: 350,
            protein: 30,
            carbs: 28,
            fat: 12,
            fiber: 5,
            ingredients: ['1 cup plain Greek yogurt (2%)', '1/2 cup mixed berries', '1 tbsp almond butter', '1 tbsp chia seeds'],
            instructions: 'Add yogurt to a bowl. Top with berries, drizzle almond butter, and sprinkle chia seeds.',
            glp1Tip: 'Eat the yogurt slowly—protein-rich foods help you feel satisfied longer on GLP-1.',
            prepTime: '5 min'
          },
          {
            type: 'lunch',
            name: 'Grilled Chicken Salad',
            description: 'Tender grilled chicken over fresh greens with avocado',
            calories: 420,
            protein: 38,
            carbs: 15,
            fat: 24,
            fiber: 8,
            ingredients: ['5 oz grilled chicken breast', '3 cups mixed greens', '1/2 avocado', '1/4 cup cherry tomatoes', '2 tbsp olive oil vinaigrette'],
            instructions: 'Arrange greens on plate. Top with sliced chicken, avocado, and tomatoes. Drizzle with dressing.',
            glp1Tip: 'Start with the chicken bites first to prioritize protein absorption.',
            prepTime: '15 min'
          },
          {
            type: 'dinner',
            name: 'Baked Salmon with Vegetables',
            description: 'Flaky salmon fillet with roasted asparagus and quinoa',
            calories: 480,
            protein: 42,
            carbs: 28,
            fat: 22,
            fiber: 6,
            ingredients: ['6 oz salmon fillet', '1 cup asparagus', '1/2 cup cooked quinoa', '1 tbsp olive oil', 'Lemon, garlic, herbs'],
            instructions: 'Season salmon and bake at 400°F for 12-15 min. Roast asparagus alongside. Serve over quinoa.',
            glp1Tip: 'If you feel full quickly, save the quinoa for later—prioritize the protein and veggies.',
            prepTime: '25 min'
          }
        ],
        snacks: [
          { name: 'Cottage cheese with cucumber', emoji: '🥒', calories: 120, protein: 14, description: '1/2 cup cottage cheese with sliced cucumber' },
          { name: 'Turkey roll-ups', emoji: '🦃', calories: 100, protein: 12, description: '3 slices turkey wrapped around cheese stick' }
        ],
        dailyTotals: { calories: 1250, protein: 110, fiber: 19 }
      },
      {
        day: 'Tuesday',
        meals: [
          {
            type: 'breakfast',
            name: 'Veggie Egg White Scramble',
            description: 'Fluffy egg whites with spinach, tomatoes, and feta',
            calories: 280,
            protein: 28,
            carbs: 12,
            fat: 14,
            fiber: 4,
            ingredients: ['5 egg whites', '1 whole egg', '1 cup spinach', '1/4 cup tomatoes', '2 tbsp feta cheese'],
            instructions: 'Sauté spinach and tomatoes. Add whisked eggs and scramble. Top with feta.',
            glp1Tip: 'Eggs are easy to digest on GLP-1—a great breakfast protein source.',
            prepTime: '10 min'
          },
          {
            type: 'lunch',
            name: 'Turkey Lettuce Wraps',
            description: 'Seasoned ground turkey in crisp lettuce cups',
            calories: 380,
            protein: 35,
            carbs: 18,
            fat: 18,
            fiber: 5,
            ingredients: ['5 oz ground turkey', 'Butter lettuce leaves', '1/4 cup diced bell peppers', 'Asian sauce', 'Green onions'],
            instructions: 'Cook seasoned turkey. Spoon into lettuce cups with peppers and sauce.',
            glp1Tip: 'Lettuce wraps are perfect for GLP-1—light but protein-packed.',
            prepTime: '15 min'
          },
          {
            type: 'dinner',
            name: 'Shrimp Stir-Fry',
            description: 'Garlic shrimp with colorful vegetables over cauliflower rice',
            calories: 420,
            protein: 38,
            carbs: 22,
            fat: 20,
            fiber: 7,
            ingredients: ['6 oz shrimp', '2 cups mixed stir-fry vegetables', '1 cup cauliflower rice', '1 tbsp sesame oil', 'Garlic, ginger, soy sauce'],
            instructions: 'Stir-fry shrimp with garlic and ginger. Add vegetables. Serve over cauliflower rice.',
            glp1Tip: 'Shrimp is lean and easy to digest—eat protein first, then veggies.',
            prepTime: '20 min'
          }
        ],
        snacks: [
          { name: 'Hard-boiled eggs', emoji: '🥚', calories: 140, protein: 12, description: '2 hard-boiled eggs with everything seasoning' },
          { name: 'Edamame', emoji: '🫛', calories: 120, protein: 11, description: '1/2 cup shelled edamame with sea salt' }
        ],
        dailyTotals: { calories: 1080, protein: 101, fiber: 16 }
      }
    ],
    hydrationTip: 'Set a timer to drink 8oz of water every 2 hours. GLP-1 can reduce thirst signals, so stay proactive!',
    weeklyTips: [
      'Eat protein first at every meal to maximize satisfaction',
      'Take small bites and chew thoroughly—this helps with GLP-1 digestion',
      'If you feel full, stop eating—save the rest for later'
    ],
    groceryCategories: {
      proteins: ['Chicken breast', 'Salmon', 'Shrimp', 'Ground turkey', 'Greek yogurt', 'Eggs', 'Cottage cheese'],
      produce: ['Mixed greens', 'Spinach', 'Asparagus', 'Bell peppers', 'Tomatoes', 'Avocado', 'Berries'],
      dairy: ['Feta cheese', 'String cheese'],
      pantry: ['Quinoa', 'Cauliflower rice', 'Olive oil', 'Chia seeds', 'Almond butter']
    }
  });

  // Step 1: Diet Type
  if (step === 1) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.mpSetupHeader}>
          <button style={styles.backButton} onClick={onCancel}>← Back</button>
          <div style={styles.mpProgressDots}>
            {[1,2,3,4].map(s => (
              <div key={s} style={{...styles.mpProgressDot, ...(s <= step ? styles.mpProgressDotActive : {})}} />
            ))}
          </div>
        </div>

        <h2 style={styles.mpStepTitle}>What's your diet style?</h2>
        <p style={styles.mpStepSubtitle}>We'll customize your meals accordingly</p>

        <div style={styles.mpOptionsGrid}>
          {dietTypes.map(diet => (
            <div
              key={diet.id}
              style={{
                ...styles.mpOptionCard,
                ...(preferences.dietType === diet.id ? styles.mpOptionCardSelected : {})
              }}
              onClick={() => setPreferences({...preferences, dietType: diet.id})}
            >
              <span style={styles.mpOptionIcon}>{diet.icon}</span>
              <p style={styles.mpOptionName}>{diet.name}</p>
              <p style={styles.mpOptionDesc}>{diet.desc}</p>
            </div>
          ))}
        </div>

        <button 
          style={{...styles.primaryButton, opacity: preferences.dietType ? 1 : 0.5}}
          className="btn-primary"
          disabled={!preferences.dietType}
          onClick={() => setStep(2)}
        >
          Continue
        </button>
      </div>
    );
  }

  // Step 2: Allergies
  if (step === 2) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.mpSetupHeader}>
          <button style={styles.backButton} onClick={() => setStep(1)}>← Back</button>
          <div style={styles.mpProgressDots}>
            {[1,2,3,4].map(s => (
              <div key={s} style={{...styles.mpProgressDot, ...(s <= step ? styles.mpProgressDotActive : {})}} />
            ))}
          </div>
        </div>

        <h2 style={styles.mpStepTitle}>Any allergies or restrictions?</h2>
        <p style={styles.mpStepSubtitle}>Select all that apply (or skip if none)</p>

        <div style={styles.mpChipGrid}>
          {allergyOptions.map(allergy => (
            <div
              key={allergy.id}
              style={{
                ...styles.mpChip,
                ...(preferences.allergies.includes(allergy.id) ? styles.mpChipSelected : {})
              }}
              onClick={() => setPreferences({
                ...preferences, 
                allergies: toggleSelection(preferences.allergies, allergy.id)
              })}
            >
              <span>{allergy.icon}</span>
              <span>{allergy.name}</span>
            </div>
          ))}
        </div>

        <div style={styles.mpDislikesSection}>
          <p style={styles.mpDislikesLabel}>Any foods you dislike? (optional)</p>
          <input
            type="text"
            placeholder="e.g., mushrooms, cilantro, olives..."
            style={styles.mpTextInput}
            onBlur={(e) => {
              const dislikes = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
              setPreferences({...preferences, dislikes});
            }}
          />
        </div>

        <button style={styles.primaryButton} className="btn-primary" onClick={() => setStep(3)}>
          Continue
        </button>
      </div>
    );
  }

  // Step 3: Cuisines & Cooking Time
  if (step === 3) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.mpSetupHeader}>
          <button style={styles.backButton} onClick={() => setStep(2)}>← Back</button>
          <div style={styles.mpProgressDots}>
            {[1,2,3,4].map(s => (
              <div key={s} style={{...styles.mpProgressDot, ...(s <= step ? styles.mpProgressDotActive : {})}} />
            ))}
          </div>
        </div>

        <h2 style={styles.mpStepTitle}>What cuisines do you enjoy?</h2>
        <p style={styles.mpStepSubtitle}>Select your favorites for more variety</p>

        <div style={styles.mpChipGrid}>
          {cuisineOptions.map(cuisine => (
            <div
              key={cuisine.id}
              style={{
                ...styles.mpChip,
                ...(preferences.cuisines.includes(cuisine.id) ? styles.mpChipSelected : {})
              }}
              onClick={() => setPreferences({
                ...preferences, 
                cuisines: toggleSelection(preferences.cuisines, cuisine.id)
              })}
            >
              <span>{cuisine.icon}</span>
              <span>{cuisine.name}</span>
            </div>
          ))}
        </div>

        <h3 style={{...styles.mpStepTitle, marginTop: '24px', fontSize: '18px'}}>How much time for cooking?</h3>
        
        <div style={styles.mpCookingOptions}>
          {cookingTimeOptions.map(option => (
            <div
              key={option.id}
              style={{
                ...styles.mpCookingOption,
                ...(preferences.cookingTime === option.id ? styles.mpCookingOptionSelected : {})
              }}
              onClick={() => setPreferences({...preferences, cookingTime: option.id})}
            >
              <span style={styles.mpCookingIcon}>{option.icon}</span>
              <span style={styles.mpCookingName}>{option.name}</span>
            </div>
          ))}
        </div>

        <button 
          style={{...styles.primaryButton, opacity: preferences.cookingTime ? 1 : 0.5}}
          className="btn-primary"
          disabled={!preferences.cookingTime}
          onClick={() => setStep(4)}
        >
          Continue
        </button>
      </div>
    );
  }

  // Step 4: Meals per day & Generate
  if (step === 4) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.mpSetupHeader}>
          <button style={styles.backButton} onClick={() => setStep(3)}>← Back</button>
          <div style={styles.mpProgressDots}>
            {[1,2,3,4].map(s => (
              <div key={s} style={{...styles.mpProgressDot, ...(s <= step ? styles.mpProgressDotActive : {})}} />
            ))}
          </div>
        </div>

        <h2 style={styles.mpStepTitle}>Almost done!</h2>
        <p style={styles.mpStepSubtitle}>A few more preferences</p>

        <div style={styles.mpMealCountSection}>
          <div style={styles.mpMealCountRow}>
            <div>
              <p style={styles.mpMealCountLabel}>Meals per day</p>
              <p style={styles.mpMealCountHint}>Most GLP-1 patients do well with 2-3</p>
            </div>
            <div style={styles.mpCounter}>
              <button 
                style={styles.mpCounterBtn}
                onClick={() => setPreferences({...preferences, mealsPerDay: Math.max(2, preferences.mealsPerDay - 1)})}
              >−</button>
              <span style={styles.mpCounterValue}>{preferences.mealsPerDay}</span>
              <button 
                style={styles.mpCounterBtn}
                onClick={() => setPreferences({...preferences, mealsPerDay: Math.min(4, preferences.mealsPerDay + 1)})}
              >+</button>
            </div>
          </div>

          <div style={styles.mpMealCountRow}>
            <div>
              <p style={styles.mpMealCountLabel}>Snacks per day</p>
              <p style={styles.mpMealCountHint}>Protein-rich snacks help maintain energy</p>
            </div>
            <div style={styles.mpCounter}>
              <button 
                style={styles.mpCounterBtn}
                onClick={() => setPreferences({...preferences, snacksPerDay: Math.max(0, preferences.snacksPerDay - 1)})}
              >−</button>
              <span style={styles.mpCounterValue}>{preferences.snacksPerDay}</span>
              <button 
                style={styles.mpCounterBtn}
                onClick={() => setPreferences({...preferences, snacksPerDay: Math.min(3, preferences.snacksPerDay + 1)})}
              >+</button>
            </div>
          </div>
        </div>

        <div style={styles.mpSummaryBox}>
          <h4 style={styles.mpSummaryTitle}>Your Preferences Summary</h4>
          <p style={styles.mpSummaryItem}>🍽️ Diet: {dietTypes.find(d => d.id === preferences.dietType)?.name || 'Omnivore'}</p>
          <p style={styles.mpSummaryItem}>⚠️ Allergies: {preferences.allergies.length > 0 ? preferences.allergies.join(', ') : 'None'}</p>
          <p style={styles.mpSummaryItem}>🌍 Cuisines: {preferences.cuisines.length > 0 ? preferences.cuisines.slice(0, 3).join(', ') : 'Any'}</p>
          <p style={styles.mpSummaryItem}>⏱️ Cooking: {cookingTimeOptions.find(c => c.id === preferences.cookingTime)?.name || 'Any'}</p>
        </div>

        {isGenerating ? (
          <div style={styles.mpGenerating}>
            <div style={styles.mpGeneratingSpinner} className="breathe">🤖</div>
            <p style={styles.mpGeneratingText}>Creating your personalized meal plan...</p>
            <p style={styles.mpGeneratingSubtext}>Optimizing for GLP-1 nutrition guidelines</p>
          </div>
        ) : (
          <button style={styles.primaryButton} className="btn-primary" onClick={generateMealPlan}>
            Generate My Meal Plan
          </button>
        )}
      </div>
    );
  }

  return null;
}

// Macro Circle Component
function MacroCircle({ label, current, goal, color, unit = 'g' }) {
  const percentage = Math.round((current / goal) * 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={styles.macroCircle}>
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={radius} fill="none" stroke="#F0EFED" strokeWidth="6" />
        <circle
          cx="45" cy="45" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 45 45)"
          className="progress-ring"
        />
      </svg>
      <div style={styles.macroCircleContent}>
        <span style={styles.macroValue}>{current}</span>
        <span style={styles.macroUnit}>{unit}</span>
      </div>
      <p style={styles.macroLabel}>{label}</p>
    </div>
  );
}

// Fitness Screen
function FitnessScreen({ user, setUser }) {
  const [showAssessment, setShowAssessment] = useState(false);

  if (!user.fitnessAssessmentComplete && !showAssessment) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <header style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Fitness</h1>
          <p style={styles.pageSubtitle}>Movement for your journey</p>
        </header>
        
        <div style={styles.assessmentPrompt}>
          <div style={styles.aiAssessmentBadge}>
            <span style={styles.aiBadgeIcon}>✨</span>
            <span style={styles.aiBadgeText}>AI-Powered</span>
          </div>
          <div style={styles.assessmentIllustration}>
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
              <circle cx="70" cy="70" r="65" fill="#E8EDE6"/>
              <circle cx="70" cy="70" r="50" stroke="#3B7D3B" strokeWidth="2" strokeDasharray="8 4"/>
              <path d="M70 40V70L90 90" stroke="#3B7D3B" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="70" cy="70" r="6" fill="#3B7D3B"/>
              <circle cx="70" cy="30" r="4" fill="#26A69A"/>
              <circle cx="110" cy="70" r="4" fill="#C4956A"/>
              <circle cx="70" cy="110" r="4" fill="#9B7E9B"/>
              <circle cx="30" cy="70" r="4" fill="#3B7D3B"/>
            </svg>
          </div>
          <h2 style={styles.assessmentTitle}>Smart Fitness Assessment</h2>
          <p style={styles.assessmentDesc}>
            Our AI will guide you through simple movements using your camera to analyze your 
            mobility, strength, and balance—then create a personalized workout plan for your GLP-1 journey.
          </p>
          
          <div style={styles.assessmentFeatures}>
            <div style={styles.assessmentFeature}>
              <span style={styles.featureIcon}>📷</span>
              <span style={styles.featureText}>Camera-guided movements</span>
            </div>
            <div style={styles.assessmentFeature}>
              <span style={styles.featureIcon}>🤖</span>
              <span style={styles.featureText}>Real-time AI analysis</span>
            </div>
            <div style={styles.assessmentFeature}>
              <span style={styles.featureIcon}>📋</span>
              <span style={styles.featureText}>Personalized workout plan</span>
            </div>
          </div>
          
          <button style={styles.primaryButton} className="btn-primary" onClick={() => setShowAssessment(true)}>
            Start AI Assessment
          </button>
          <p style={styles.assessmentNote}>Takes about 3-5 minutes · Camera required</p>
        </div>
      </div>
    );
  }

  if (showAssessment) {
    return (
      <AIFitnessAssessment 
        onComplete={(results) => {
          setUser({
            ...user, 
            fitnessAssessmentComplete: true,
            fitnessLevel: results.level,
            workoutPlan: results.plan,
            equipment: results.equipment || []
          });
          setShowAssessment(false);
        }}
        onCancel={() => setShowAssessment(false)}
      />
    );
  }

  return <FitnessHomeScreen user={user} />;
}

// AI Fitness Assessment Component
function AIFitnessAssessment({ onComplete, onCancel }) {
  const [stage, setStage] = useState('intro'); // intro, camera-setup, exercise, equipment, analyzing, results
  const [currentExercise, setCurrentExercise] = useState(0);
  const [exerciseState, setExerciseState] = useState('ready'); // ready, countdown, performing, captured, analyzing
  const [countdown, setCountdown] = useState(3);
  const [capturedFrames, setCapturedFrames] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [finalResults, setFinalResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const exercises = [
    {
      id: 'squat',
      name: 'Bodyweight Squat',
      instruction: 'Stand with feet shoulder-width apart, then lower into a squat position',
      duration: 5,
      icon: '🏋️',
      analyzeFor: ['depth', 'knee_alignment', 'back_position']
    },
    {
      id: 'balance',
      name: 'Single Leg Balance',
      instruction: 'Stand on one leg with arms out to the sides for balance',
      duration: 5,
      icon: '🧘',
      analyzeFor: ['stability', 'posture', 'duration']
    },
    {
      id: 'reach',
      name: 'Overhead Reach',
      instruction: 'Raise both arms straight overhead and stretch upward',
      duration: 4,
      icon: '🙆',
      analyzeFor: ['shoulder_mobility', 'spine_alignment', 'range_of_motion']
    },
    {
      id: 'march',
      name: 'Standing March',
      instruction: 'March in place, bringing knees up to hip level',
      duration: 5,
      icon: '🚶',
      analyzeFor: ['hip_mobility', 'coordination', 'posture']
    }
  ];

  const equipmentOptions = [
    { id: 'none', name: 'No Equipment', icon: '🏠', description: 'Bodyweight exercises only' },
    { id: 'dumbbells', name: 'Dumbbells', icon: '🏋️', description: 'Any weight set' },
    { id: 'resistance_bands', name: 'Resistance Bands', icon: '🔴', description: 'Loop or tube bands' },
    { id: 'kettlebell', name: 'Kettlebell', icon: '🔔', description: 'Any size kettlebell' },
    { id: 'yoga_mat', name: 'Yoga Mat', icon: '🧘', description: 'For floor exercises' },
    { id: 'stability_ball', name: 'Stability Ball', icon: '⚪', description: 'Exercise/Swiss ball' },
    { id: 'pull_up_bar', name: 'Pull-Up Bar', icon: '🚪', description: 'Doorway or mounted' },
    { id: 'bench', name: 'Workout Bench', icon: '🪑', description: 'Flat or adjustable' },
    { id: 'foam_roller', name: 'Foam Roller', icon: '🧴', description: 'For recovery & mobility' },
    { id: 'jump_rope', name: 'Jump Rope', icon: '〰️', description: 'For cardio workouts' },
    { id: 'trx', name: 'TRX/Suspension', icon: '⛓️', description: 'Suspension trainer' },
    { id: 'gym_access', name: 'Full Gym Access', icon: '🏢', description: 'Machines & full equipment' },
  ];

  const toggleEquipment = (id) => {
    if (id === 'none') {
      setSelectedEquipment(['none']);
    } else {
      setSelectedEquipment(prev => {
        const filtered = prev.filter(e => e !== 'none');
        if (filtered.includes(id)) {
          return filtered.filter(e => e !== id);
        } else {
          return [...filtered, id];
        }
      });
    }
  };

  // Camera setup - Mobile optimized
  const startCamera = useCallback(async () => {
    try {
      // Check if we're in a secure context (HTTPS required for camera)
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        setCameraError('Camera requires a secure connection (HTTPS). Please access this app via HTTPS.');
        return;
      }
      
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera not supported on this device. Please use the manual assessment instead.');
        return;
      }
      
      // Mobile-optimized constraints
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const constraints = {
        video: {
          facingMode: 'user', // Front camera for selfie view
          width: isMobile ? { ideal: 480 } : { ideal: 640 },
          height: isMobile ? { ideal: 640 } : { ideal: 480 },
        },
        audio: false
      };
      
      // Try to get camera stream
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (firstError) {
        // If specific constraints fail, try with basic constraints
        console.log('First attempt failed, trying basic constraints');
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Mobile-specific attributes
        videoRef.current.setAttribute('autoplay', '');
        videoRef.current.setAttribute('playsinline', '');
        videoRef.current.setAttribute('muted', '');
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = async () => {
          try {
            // Mobile browsers often need user interaction to play
            await videoRef.current.play();
            setStage('exercise');
          } catch (playErr) {
            console.warn('Auto-play prevented, proceeding anyway:', playErr);
            setStage('exercise');
          }
        };
        
        // Fallback if onloadedmetadata doesn't fire
        setTimeout(() => {
          if (stage === 'camera-setup') {
            videoRef.current?.play().catch(() => {});
            setStage('exercise');
          }
        }, 3000);
      } else {
        setStage('exercise');
      }
    } catch (err) {
      console.error('Camera error:', err);
      let errorMessage = 'Unable to access camera. ';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied. Please allow camera access:\n\n';
        errorMessage += '• iPhone/iPad: Settings → Safari → Camera → Allow\n';
        errorMessage += '• Android: Settings → Apps → Browser → Permissions → Camera\n';
        errorMessage += '• Or tap the camera icon in your browser\'s address bar';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera found. Please make sure your device has a camera.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Camera is in use by another app. Please close other apps using the camera and try again.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera settings not supported. Please try again.';
      } else if (err.name === 'SecurityError') {
        errorMessage = 'Camera access blocked. This app requires HTTPS for camera access.';
      } else {
        errorMessage += 'Please check your camera permissions and try again.';
      }
      
      setCameraError(errorMessage);
    }
  }, [stage]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // Capture frame from video
  const captureFrame = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      return canvas.toDataURL('image/jpeg', 0.8);
    }
    return null;
  }, []);

  // Exercise flow
  const startExercise = useCallback(() => {
    setExerciseState('countdown');
    setCountdown(3);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (exerciseState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (exerciseState === 'countdown' && countdown === 0) {
      setExerciseState('performing');
      setCapturedFrames([]);
    }
  }, [exerciseState, countdown]);

  // Capture frames during exercise
  useEffect(() => {
    if (exerciseState === 'performing') {
      const exercise = exercises[currentExercise];
      const captureInterval = setInterval(() => {
        const frame = captureFrame();
        if (frame) {
          setCapturedFrames(prev => [...prev, frame]);
        }
      }, 500); // Capture every 500ms

      const exerciseTimer = setTimeout(() => {
        clearInterval(captureInterval);
        setExerciseState('captured');
      }, exercise.duration * 1000);

      return () => {
        clearInterval(captureInterval);
        clearTimeout(exerciseTimer);
      };
    }
  }, [exerciseState, currentExercise, captureFrame]);

  // Analyze captured frames with AI
  useEffect(() => {
    if (exerciseState === 'captured' && capturedFrames.length > 0) {
      analyzeExercise();
    }
  }, [exerciseState, capturedFrames]);

  const analyzeExercise = async () => {
    setExerciseState('analyzing');
    setIsAnalyzing(true);

    const exercise = exercises[currentExercise];
    
    // Select best frames (first, middle, last)
    const frameIndices = [0, Math.floor(capturedFrames.length / 2), capturedFrames.length - 1];
    const selectedFrames = frameIndices.map(i => capturedFrames[Math.min(i, capturedFrames.length - 1)]);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: [
              ...selectedFrames.map((frame, idx) => ({
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: frame.split(',')[1]
                }
              })),
              {
                type: 'text',
                text: `You are a fitness assessment AI for a GLP-1 wellness app. Analyze these ${selectedFrames.length} images of a person performing a "${exercise.name}" exercise.

The person was instructed to: "${exercise.instruction}"

Please analyze their form and provide a JSON response with the following structure (respond ONLY with JSON, no markdown):
{
  "exerciseDetected": true/false,
  "formScore": 1-10,
  "observations": ["observation 1", "observation 2"],
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "mobilityLevel": "limited" | "moderate" | "good" | "excellent",
  "safetyNotes": ["any safety concerns"]
}

Be encouraging but honest. Consider that this person is on a GLP-1 medication for weight management and may be new to exercise. Focus on what they did well while noting areas for improvement.`
              }
            ]
          }]
        })
      });

      const data = await response.json();
      const analysisText = data.content.map(c => c.text || '').join('');
      
      // Parse JSON from response
      let analysis;
      try {
        const cleanJson = analysisText.replace(/```json|```/g, '').trim();
        analysis = JSON.parse(cleanJson);
      } catch {
        // Default analysis if parsing fails
        analysis = {
          exerciseDetected: true,
          formScore: 7,
          observations: ['Movement detected and analyzed'],
          strengths: ['Good effort and willingness to assess'],
          improvements: ['Continue practicing for better form'],
          mobilityLevel: 'moderate',
          safetyNotes: []
        };
      }

      setAnalysisResults(prev => [...prev, { exercise: exercise.id, ...analysis }]);
      setIsAnalyzing(false);

      // Move to next exercise or finish
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setExerciseState('ready');
        setCapturedFrames([]);
      } else {
        // Go to equipment selection instead of directly to analyzing
        setStage('equipment');
      }

    } catch (error) {
      console.error('Analysis error:', error);
      // Continue with default results on error
      const defaultAnalysis = {
        exerciseDetected: true,
        formScore: 7,
        observations: ['Movement completed'],
        strengths: ['Completed the exercise'],
        improvements: ['Keep practicing'],
        mobilityLevel: 'moderate',
        safetyNotes: []
      };
      
      setAnalysisResults(prev => [...prev, { exercise: exercise.id, ...defaultAnalysis }]);
      setIsAnalyzing(false);

      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setExerciseState('ready');
        setCapturedFrames([]);
      } else {
        // Go to equipment selection instead of directly to analyzing
        setStage('equipment');
      }
    }
  };

  const generateFinalResults = async (allResults, equipment) => {
    setStage('analyzing');
    stopCamera();

    const equipmentList = equipment.length > 0 
      ? equipment.map(id => equipmentOptions.find(e => e.id === id)?.name).filter(Boolean).join(', ')
      : 'No equipment (bodyweight only)';

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `You are a fitness coach AI creating a personalized workout plan for a GLP-1 patient. Based on these fitness assessment results and available equipment, create a comprehensive but gentle workout plan.

Assessment Results:
${JSON.stringify(allResults, null, 2)}

Available Equipment: ${equipmentList}

Create a JSON response with this structure (respond ONLY with JSON, no markdown):
{
  "overallLevel": "beginner" | "intermediate" | "advanced",
  "overallScore": 1-100,
  "summary": "2-3 sentence summary of their fitness level",
  "strengths": ["key strength 1", "key strength 2", "key strength 3"],
  "focusAreas": ["area to improve 1", "area to improve 2"],
  "equipmentUsed": ["list of equipment incorporated into the plan"],
  "weeklyPlan": {
    "daysPerWeek": 3-5,
    "minutesPerSession": 15-45,
    "workouts": [
      {
        "day": "Monday",
        "name": "Workout Name",
        "type": "strength" | "cardio" | "flexibility" | "balance",
        "duration": "XX min",
        "exercises": [
          {"name": "Exercise", "sets": "X", "reps": "X", "equipment": "equipment needed or bodyweight", "notes": "any modifications"}
        ]
      }
    ]
  },
  "safetyRecommendations": ["recommendation 1", "recommendation 2"],
  "progressionTips": ["tip for advancing over time"],
  "equipmentToBuy": ["optional equipment that would enhance their workouts"]
}

Important considerations:
- This person is on GLP-1 medication for weight management
- Focus on muscle preservation (very important during weight loss)
- ONLY use exercises that match their available equipment: ${equipmentList}
- Include low-impact options
- Emphasize consistency over intensity
- Make it achievable and encouraging
- If they have limited equipment, be creative with bodyweight variations`
          }]
        })
      });

      const data = await response.json();
      const planText = data.content.map(c => c.text || '').join('');
      
      let plan;
      try {
        const cleanJson = planText.replace(/```json|```/g, '').trim();
        plan = JSON.parse(cleanJson);
      } catch {
        plan = getDefaultPlan();
      }

      setFinalResults(plan);
      setStage('results');

    } catch (error) {
      console.error('Plan generation error:', error);
      setFinalResults(getDefaultPlan(selectedEquipment));
      setStage('results');
    }
  };

  const getDefaultPlan = (equipment = []) => ({
    overallLevel: 'beginner',
    overallScore: 65,
    summary: 'You show good foundational movement patterns with room for improvement in mobility and stability. A gentle, progressive program will help you build strength while preserving muscle during your GLP-1 journey.',
    strengths: ['Willingness to move', 'Basic movement patterns', 'Good attitude'],
    focusAreas: ['Core stability', 'Lower body strength', 'Flexibility'],
    equipmentUsed: equipment.length > 0 ? equipment : ['Bodyweight'],
    weeklyPlan: {
      daysPerWeek: 3,
      minutesPerSession: 20,
      workouts: [
        {
          day: 'Monday',
          name: 'Gentle Strength',
          type: 'strength',
          duration: '20 min',
          exercises: [
            { name: 'Wall Push-ups', sets: '2', reps: '10', equipment: 'Bodyweight', notes: 'Keep core engaged' },
            { name: 'Chair Squats', sets: '2', reps: '8', equipment: 'Bodyweight', notes: 'Use chair for support' },
            { name: equipment.includes('resistance_bands') ? 'Banded Rows' : 'Standing Rows', sets: '2', reps: '10', equipment: equipment.includes('resistance_bands') ? 'Resistance Band' : 'Bodyweight', notes: 'Squeeze shoulder blades' }
          ]
        },
        {
          day: 'Wednesday',
          name: 'Balance & Core',
          type: 'balance',
          duration: '20 min',
          exercises: [
            { name: 'Single Leg Stands', sets: '2', reps: '30 sec each', equipment: 'Bodyweight', notes: 'Hold wall if needed' },
            { name: 'Bird Dogs', sets: '2', reps: '8 each side', equipment: equipment.includes('yoga_mat') ? 'Yoga Mat' : 'Bodyweight', notes: 'Slow and controlled' },
            { name: 'Gentle Stretching', sets: '1', reps: '5 min', equipment: equipment.includes('yoga_mat') ? 'Yoga Mat' : 'Bodyweight', notes: 'Full body' }
          ]
        },
        {
          day: 'Friday',
          name: 'Active Recovery',
          type: 'cardio',
          duration: '20 min',
          exercises: [
            { name: 'Walking', sets: '1', reps: '15 min', equipment: 'None', notes: 'Moderate pace' },
            { name: 'Arm Circles', sets: '2', reps: '10 each direction', equipment: 'Bodyweight', notes: 'Warm up shoulders' },
            { name: 'Calf Raises', sets: '2', reps: '12', equipment: 'Bodyweight', notes: 'Hold wall for balance' }
          ]
        }
      ]
    },
    safetyRecommendations: ['Stay hydrated during workouts', 'Stop if you feel dizzy', 'Listen to your body'],
    progressionTips: ['Add 1-2 reps per week', 'Gradually increase duration'],
    equipmentToBuy: equipment.length === 0 || equipment.includes('none') ? ['Resistance bands - versatile and affordable', 'Yoga mat for floor exercises'] : []
  });

  // Render different stages
  if (stage === 'intro') {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.assessmentHeader}>
          <button style={styles.backButton} onClick={onCancel}>← Back</button>
          <h2 style={styles.assessmentStageTitle}>AI Fitness Assessment</h2>
        </div>
        
        <div style={styles.introContent}>
          <div style={styles.cameraPreviewBox}>
            <div style={styles.cameraIcon}>📷</div>
            <p style={styles.cameraText}>Camera Preview</p>
          </div>
          
          <h3 style={styles.introTitle}>Here's what we'll do:</h3>
          <div style={styles.exercisePreviewList}>
            {exercises.map((ex, idx) => (
              <div key={idx} style={styles.exercisePreviewItem}>
                <span style={styles.exercisePreviewIcon}>{ex.icon}</span>
                <div>
                  <p style={styles.exercisePreviewName}>{ex.name}</p>
                  <p style={styles.exercisePreviewDuration}>{ex.duration} seconds</p>
                </div>
              </div>
            ))}
          </div>
          
          <div style={styles.privacyNote}>
            <span style={styles.privacyIcon}>🔒</span>
            <p style={styles.privacyText}>Your video is analyzed in real-time and never stored. Privacy first.</p>
          </div>
          
          <button style={styles.primaryButton} className="btn-primary" onClick={() => { setStage('camera-setup'); startCamera(); }}>
            Enable Camera & Start
          </button>
          <button style={styles.secondaryButton} onClick={() => setStage('manual')}>
            Quick Assessment (No Camera)
          </button>
        </div>
      </div>
    );
  }

  if (cameraError) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>📷</div>
          <h2 style={styles.errorTitle}>Camera Access Needed</h2>
          <p style={{...styles.errorText, whiteSpace: 'pre-line', textAlign: 'left', maxWidth: '300px'}}>{cameraError}</p>
          <button style={styles.primaryButton} className="btn-primary" onClick={() => { setCameraError(null); startCamera(); }}>
            Try Again
          </button>
          <button style={styles.secondaryButton} onClick={() => setStage('manual')}>
            Quick Assessment Instead
          </button>
          <button style={{...styles.secondaryButton, marginTop: '8px', background: 'transparent'}} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Manual/Quick Assessment without camera
  if (stage === 'manual') {
    const fitnessLevels = [
      { id: 'beginner', label: 'Beginner', desc: 'New to exercise or returning after a long break', icon: '🌱' },
      { id: 'intermediate', label: 'Intermediate', desc: 'Exercise 2-3 times per week regularly', icon: '🌿' },
      { id: 'advanced', label: 'Advanced', desc: 'Exercise 4+ times per week with good form', icon: '🌳' }
    ];
    
    return (
      <div style={styles.screenContent} className="fade-in">
        <header style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Quick Assessment</h1>
          <p style={styles.pageSubtitle}>Select your fitness level</p>
        </header>
        
        <div style={styles.manualAssessmentList}>
          {fitnessLevels.map(level => (
            <button
              key={level.id}
              style={styles.fitnessLevelCard}
              onClick={() => {
                setStage('equipment');
                // Set a mock result based on selection
                setAnalysisResult({
                  fitnessLevel: level.id,
                  scores: {
                    strength: level.id === 'beginner' ? 40 : level.id === 'intermediate' ? 65 : 85,
                    flexibility: level.id === 'beginner' ? 45 : level.id === 'intermediate' ? 60 : 80,
                    balance: level.id === 'beginner' ? 50 : level.id === 'intermediate' ? 70 : 85,
                    endurance: level.id === 'beginner' ? 35 : level.id === 'intermediate' ? 60 : 82
                  },
                  summary: `Based on your self-assessment as ${level.label.toLowerCase()}, we'll create a personalized workout plan.`
                });
              }}
            >
              <span style={styles.fitnessLevelIcon}>{level.icon}</span>
              <div style={styles.fitnessLevelContent}>
                <h3 style={styles.fitnessLevelTitle}>{level.label}</h3>
                <p style={styles.fitnessLevelDesc}>{level.desc}</p>
              </div>
              <span style={styles.fitnessLevelArrow}>→</span>
            </button>
          ))}
        </div>
        
        <button style={styles.secondaryButton} onClick={onCancel}>
          Cancel
        </button>
      </div>
    );
  }

  if (stage === 'camera-setup') {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.cameraSetupContainer}>
          <div style={styles.loadingSpinner} className="pulse">
            <span style={styles.spinnerIcon}>📷</span>
          </div>
          <p style={styles.setupText}>Setting up camera...</p>
        </div>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          webkit-playsinline="true"
          x5-playsinline="true"
          style={{ display: 'none' }} 
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  if (stage === 'exercise') {
    const exercise = exercises[currentExercise];
    
    return (
      <div style={styles.cameraFullScreen}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          webkit-playsinline="true"
          x5-playsinline="true"
          x5-video-player-type="h5"
          style={{
            ...styles.cameraVideo,
            transform: 'scaleX(-1)', // Mirror for selfie view
          }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {/* Overlay UI */}
        <div style={styles.cameraOverlay}>
          {/* Progress indicator */}
          <div style={styles.exerciseProgress}>
            {exercises.map((_, idx) => (
              <div 
                key={idx} 
                style={{
                  ...styles.exerciseProgressDot,
                  backgroundColor: idx < currentExercise ? '#3B7D3B' : idx === currentExercise ? '#FFFFFF' : 'rgba(255,255,255,0.3)'
                }}
              />
            ))}
          </div>
          
          {/* Exercise info card */}
          <div style={styles.exerciseInfoCard}>
            <span style={styles.exerciseNumber}>Exercise {currentExercise + 1} of {exercises.length}</span>
            <h2 style={styles.exerciseNameLarge}>{exercise.icon} {exercise.name}</h2>
            <p style={styles.exerciseInstruction}>{exercise.instruction}</p>
          </div>

          {/* Center content based on state */}
          {exerciseState === 'ready' && (
            <div style={styles.centerContent}>
              <button style={styles.startExerciseButton} onClick={startExercise}>
                <span style={styles.startButtonText}>Start</span>
              </button>
              <p style={styles.positionText}>Position yourself in frame</p>
            </div>
          )}

          {exerciseState === 'countdown' && (
            <div style={styles.centerContent}>
              <div style={styles.countdownCircle} className="pulse">
                <span style={styles.countdownNumber}>{countdown}</span>
              </div>
              <p style={styles.getReadyText}>Get ready!</p>
            </div>
          )}

          {exerciseState === 'performing' && (
            <div style={styles.centerContent}>
              <div style={styles.recordingIndicator}>
                <div style={styles.recordingDot} />
                <span style={styles.recordingText}>Analyzing...</span>
              </div>
              <div style={styles.scanningOverlay}>
                <div style={styles.scanningLine} className="scanning-line" />
              </div>
            </div>
          )}

          {(exerciseState === 'captured' || exerciseState === 'analyzing') && (
            <div style={styles.centerContent}>
              <div style={styles.analyzingSpinner} className="breathe">
                <span style={styles.analyzingIcon}>🤖</span>
              </div>
              <p style={styles.analyzingText}>AI analyzing your form...</p>
            </div>
          )}

          {/* Cancel button */}
          <button style={styles.cancelAssessmentButton} onClick={() => { stopCamera(); onCancel(); }}>
            ✕
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'analyzing') {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.analyzingContainer}>
          <div style={styles.analyzingAnimation} className="breathe">
            <span style={styles.analyzingMainIcon}>🤖</span>
          </div>
          <h2 style={styles.analyzingTitle}>Creating Your Plan</h2>
          <p style={styles.analyzingSubtext}>Our AI is analyzing your movements and building a personalized workout plan with your equipment...</p>
          
          <div style={styles.analysisSteps}>
            <div style={styles.analysisStep}>
              <span style={styles.stepCheck}>✓</span>
              <span style={styles.stepText}>Movement analysis complete</span>
            </div>
            <div style={styles.analysisStep}>
              <span style={styles.stepCheck}>✓</span>
              <span style={styles.stepText}>Form assessment done</span>
            </div>
            <div style={styles.analysisStep}>
              <span style={styles.stepCheck}>✓</span>
              <span style={styles.stepText}>Equipment preferences saved</span>
            </div>
            <div style={{...styles.analysisStep, opacity: 0.6}}>
              <span style={styles.stepSpinner}>○</span>
              <span style={styles.stepText}>Generating workout plan...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'equipment') {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.assessmentHeader}>
          <button style={styles.backButton} onClick={() => setStage('exercise')}>← Back</button>
          <h2 style={styles.assessmentStageTitle}>Your Equipment</h2>
        </div>

        <div style={styles.equipmentIntro}>
          <div style={styles.equipmentIcon}>🎒</div>
          <h3 style={styles.equipmentTitle}>What equipment do you have?</h3>
          <p style={styles.equipmentSubtitle}>Select all that you have access to. We'll create workouts that use your available equipment.</p>
        </div>

        <div style={styles.equipmentGrid}>
          {equipmentOptions.map((item) => (
            <div
              key={item.id}
              style={{
                ...styles.equipmentCard,
                ...(selectedEquipment.includes(item.id) ? styles.equipmentCardSelected : {})
              }}
              onClick={() => toggleEquipment(item.id)}
            >
              <div style={styles.equipmentCardIcon}>{item.icon}</div>
              <div style={styles.equipmentCardContent}>
                <p style={styles.equipmentCardName}>{item.name}</p>
                <p style={styles.equipmentCardDesc}>{item.description}</p>
              </div>
              <div style={{
                ...styles.equipmentCheckbox,
                ...(selectedEquipment.includes(item.id) ? styles.equipmentCheckboxSelected : {})
              }}>
                {selectedEquipment.includes(item.id) && '✓'}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.equipmentFooter}>
          <p style={styles.equipmentNote}>
            {selectedEquipment.length === 0 
              ? 'Select at least one option to continue'
              : selectedEquipment.includes('none')
                ? 'Bodyweight workouts selected'
                : `${selectedEquipment.length} item${selectedEquipment.length > 1 ? 's' : ''} selected`
            }
          </p>
          <button 
            style={{
              ...styles.primaryButton,
              opacity: selectedEquipment.length === 0 ? 0.5 : 1
            }} 
            className="btn-primary"
            disabled={selectedEquipment.length === 0}
            onClick={() => {
              if (selectedEquipment.length > 0) {
                generateFinalResults(analysisResults, selectedEquipment);
              }
            }}
          >
            Generate My Workout Plan
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'results' && finalResults) {
    return (
      <div style={styles.screenContent} className="fade-in">
        <div style={styles.resultsHeader}>
          <div style={styles.resultsBadge}>
            <span style={styles.resultsBadgeText}>Assessment Complete</span>
          </div>
          <div style={styles.scoreCircle}>
            <span style={styles.scoreNumber}>{finalResults.overallScore}</span>
            <span style={styles.scoreLabel}>Score</span>
          </div>
          <h2 style={styles.levelBadge}>{finalResults.overallLevel.charAt(0).toUpperCase() + finalResults.overallLevel.slice(1)} Level</h2>
          <p style={styles.summaryText}>{finalResults.summary}</p>
        </div>

        <div style={styles.resultsSection}>
          <h3 style={styles.resultsSectionTitle}>💪 Your Strengths</h3>
          <div style={styles.tagList}>
            {finalResults.strengths.map((s, i) => (
              <span key={i} style={styles.strengthTag}>{s}</span>
            ))}
          </div>
        </div>

        <div style={styles.resultsSection}>
          <h3 style={styles.resultsSectionTitle}>🎯 Focus Areas</h3>
          <div style={styles.tagList}>
            {finalResults.focusAreas.map((f, i) => (
              <span key={i} style={styles.focusTag}>{f}</span>
            ))}
          </div>
        </div>

        {finalResults.equipmentUsed && finalResults.equipmentUsed.length > 0 && (
          <div style={styles.resultsSection}>
            <h3 style={styles.resultsSectionTitle}>🎒 Equipment in Your Plan</h3>
            <div style={styles.tagList}>
              {finalResults.equipmentUsed.map((e, i) => (
                <span key={i} style={styles.equipmentTag}>{e}</span>
              ))}
            </div>
          </div>
        )}

        <div style={styles.resultsSection}>
          <h3 style={styles.resultsSectionTitle}>📅 Your Weekly Plan</h3>
          <p style={styles.planOverview}>
            {finalResults.weeklyPlan.daysPerWeek} days/week · {finalResults.weeklyPlan.minutesPerSession} min/session
          </p>
          <div style={styles.workoutPreviewList}>
            {finalResults.weeklyPlan.workouts.slice(0, 3).map((w, i) => (
              <div key={i} style={styles.workoutPreviewCard}>
                <span style={styles.workoutDay}>{w.day}</span>
                <span style={styles.workoutName2}>{w.name}</span>
                <span style={styles.workoutDuration}>{w.duration}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.safetySection}>
          <h4 style={styles.safetyTitle}>⚠️ Safety Notes</h4>
          {finalResults.safetyRecommendations.map((s, i) => (
            <p key={i} style={styles.safetyItem}>• {s}</p>
          ))}
        </div>

        {finalResults.equipmentToBuy && finalResults.equipmentToBuy.length > 0 && (
          <div style={styles.equipmentSuggestionSection}>
            <h4 style={styles.equipmentSuggestionTitle}>💡 Optional Equipment to Consider</h4>
            {finalResults.equipmentToBuy.map((e, i) => (
              <p key={i} style={styles.equipmentSuggestionItem}>• {e}</p>
            ))}
          </div>
        )}

        <button 
          style={styles.primaryButton} 
          className="btn-primary"
          onClick={() => onComplete({ level: finalResults.overallLevel, plan: finalResults, equipment: selectedEquipment })}
        >
          Start My Workout Plan
        </button>
      </div>
    );
  }

  return null;
}

// Fitness Home Screen (after assessment)
function FitnessHomeScreen({ user }) {
  const plan = user.workoutPlan;
  const todayWorkout = plan?.weeklyPlan?.workouts?.[0] || {
    name: 'Gentle Strength',
    duration: '20 min',
    type: 'strength',
    exercises: []
  };

  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Fitness</h1>
        <p style={styles.pageSubtitle}>Your personalized plan</p>
      </header>

      <div style={styles.levelCard}>
        <span style={styles.levelLabel}>Your Level</span>
        <span style={styles.levelValue}>{user.fitnessLevel?.charAt(0).toUpperCase() + user.fitnessLevel?.slice(1) || 'Beginner'}</span>
      </div>

      {user.equipment && user.equipment.length > 0 && !user.equipment.includes('none') && (
        <div style={styles.equipmentBadge}>
          <span style={styles.equipmentBadgeLabel}>🎒 Your Equipment</span>
          <div style={styles.equipmentBadgeList}>
            {user.equipment.slice(0, 4).map((eq, i) => {
              const equipmentItem = [
                { id: 'dumbbells', name: 'Dumbbells' },
                { id: 'resistance_bands', name: 'Bands' },
                { id: 'kettlebell', name: 'Kettlebell' },
                { id: 'yoga_mat', name: 'Mat' },
                { id: 'stability_ball', name: 'Ball' },
                { id: 'pull_up_bar', name: 'Pull-up Bar' },
                { id: 'bench', name: 'Bench' },
                { id: 'foam_roller', name: 'Roller' },
                { id: 'jump_rope', name: 'Jump Rope' },
                { id: 'trx', name: 'TRX' },
                { id: 'gym_access', name: 'Gym' },
              ].find(e => e.id === eq);
              return equipmentItem ? (
                <span key={i} style={styles.equipmentBadgeItem}>{equipmentItem.name}</span>
              ) : null;
            })}
            {user.equipment.length > 4 && (
              <span style={styles.equipmentBadgeItem}>+{user.equipment.length - 4}</span>
            )}
          </div>
        </div>
      )}

      <div style={styles.todayWorkout}>
        <span style={styles.todayLabel}>Today's Workout</span>
        <h2 style={styles.todayTitle}>{todayWorkout.name}</h2>
        <p style={styles.todayDesc}>{plan?.summary || 'A workout designed for your fitness level'}</p>
        <div style={styles.todayMeta}>
          <span style={styles.todayTag}>{todayWorkout.duration}</span>
          <span style={styles.todayTag}>{user.fitnessLevel || 'Beginner'}</span>
          <span style={styles.todayTag}>{todayWorkout.type}</span>
        </div>
        <button style={styles.primaryButtonWhite}>Start Workout</button>
      </div>

      {todayWorkout.exercises?.length > 0 && (
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Exercises</h3>
          <div style={styles.exerciseList}>
            {todayWorkout.exercises.map((ex, idx) => (
              <div key={idx} style={styles.exerciseCard} className="card-hover">
                <div style={styles.exerciseIndex}>{idx + 1}</div>
                <div style={styles.exerciseDetails}>
                  <h4 style={styles.exerciseTitle}>{ex.name}</h4>
                  <p style={styles.exerciseMeta}>{ex.sets} sets × {ex.reps}</p>
                  {ex.equipment && ex.equipment !== 'Bodyweight' && ex.equipment !== 'None' && (
                    <p style={styles.exerciseEquipment}>🎒 {ex.equipment}</p>
                  )}
                  {ex.notes && <p style={styles.exerciseNotes}>{ex.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={styles.section}>
        <div style={styles.activityCard}>
          <h4 style={styles.activityTitle}>This Week's Activity</h4>
          <div style={styles.activityBars}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <div key={idx} style={styles.activityDay}>
                <div style={styles.activityBarContainer}>
                  <div style={{
                    ...styles.activityBar,
                    height: `${[60, 80, 40, 100, 70, 20, 0][idx]}%`
                  }} />
                </div>
                <span style={styles.activityDayLabel}>{day}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Treatments Screen - All HYDR801 Services
function TreatmentsScreen({ setActiveModal }) {
  const [activeCategory, setActiveCategory] = useState('weight-loss');

  const categories = [
    { id: 'weight-loss', name: 'Weight Loss', icon: '⚖️' },
    { id: 'iv-therapy', name: 'IV Therapy', icon: '💧' },
    { id: 'vitamin-boosters', name: 'Boosters', icon: '💉' },
    { id: 'hormone', name: 'Hormone', icon: '🧬' },
    { id: 'body', name: 'Body', icon: '✨' },
  ];

  const services = {
    'weight-loss': {
      title: 'Weight Loss Injections',
      description: 'Medical weight loss solutions including GLP-1 medications to help you reach your goals.',
      items: [
        {
          id: 'semaglutide',
          name: 'Semaglutide',
          tagline: 'GLP-1 Weight Loss',
          description: 'FDA-approved GLP-1 medication that helps control appetite and blood sugar levels for effective weight loss.',
          benefits: ['Reduces appetite', 'Controls cravings', 'Improves blood sugar', 'Weekly injection'],
          pricing: [
            { label: 'Initial consult + first month', price: '$300' },
            { label: '0.25mg - 2mg/month', price: '$200' },
            { label: '2.25mg - 2.5mg/month', price: '$300' },
          ],
          popular: true
        },
        {
          id: 'tirzepatide',
          name: 'Tirzepatide',
          tagline: 'Dual-Action GLP-1/GIP',
          description: 'Next-generation weight loss medication targeting both GLP-1 and GIP receptors for enhanced results.',
          benefits: ['Dual hormone action', 'Superior weight loss', 'Improved metabolism', 'Weekly injection'],
          pricing: [
            { label: 'Initial consult + first month', price: '$300' },
            { label: '2.5mg/month', price: '$200' },
            { label: '5mg/month', price: '$250' },
            { label: '7.5mg/month', price: '$300' },
            { label: '10mg/month', price: '$350' },
            { label: '12.5mg/month', price: '$412.50' },
            { label: '15mg/month', price: '$475' },
          ],
          popular: true
        },
        {
          id: 'phentermine',
          name: 'Phentermine',
          tagline: 'Appetite Suppressant',
          description: 'Proven appetite suppressant to help control hunger and support your weight loss journey.',
          benefits: ['Reduces hunger', 'Boosts energy', 'Short-term use', 'Daily oral medication'],
          pricing: [
            { label: 'Monthly supply', price: '$40' },
          ],
          popular: false
        },
      ]
    },
    'iv-therapy': {
      title: 'IV Therapy',
      description: 'Premium IV infusions delivering vitamins, minerals, and hydration directly to your bloodstream.',
      items: [
        {
          id: 'immunity-boost',
          name: 'Immunity Boost',
          tagline: 'Improvement Tier',
          description: 'Fortify your body\'s defenses to stay strong and healthy with immune-supporting nutrients.',
          benefits: ['Boosts immune system', 'Fights illness', 'Vitamin C & Zinc', '1000cc saline base'],
          pricing: [{ label: 'Per session', price: '$149' }],
          popular: false,
          tier: 'improvement'
        },
        {
          id: 'gut-boost',
          name: 'Gut Boost',
          tagline: 'Improvement Tier',
          description: 'Repair and heal your gut lining to feel your best inside and out.',
          benefits: ['Gut health', 'Reduces inflammation', 'Improves digestion', 'Healing nutrients'],
          pricing: [{ label: 'Per session', price: '$149' }],
          popular: false,
          tier: 'improvement'
        },
        {
          id: 'detox-boost',
          name: 'Detox Boost',
          tagline: 'Improvement Tier',
          description: 'Cleanse and rejuvenate with a blend formulated to flush out toxins and impurities.',
          benefits: ['Flushes toxins', 'Liver support', 'Glutathione', 'Rejuvenating'],
          pricing: [{ label: 'Per session', price: '$149' }],
          popular: false,
          tier: 'improvement'
        },
        {
          id: 'beauty-boost',
          name: 'Beauty Boost',
          tagline: 'Upgrade Tier',
          description: 'Luxurious blend to strengthen hair and reduce skin inflammation for radiant beauty.',
          benefits: ['Glowing skin', 'Stronger hair', 'Biotin & collagen', 'Anti-inflammatory'],
          pricing: [{ label: 'Per session', price: '$179' }],
          popular: true,
          tier: 'upgrade'
        },
        {
          id: 'recovery-boost',
          name: 'Recovery Boost',
          tagline: 'Upgrade Tier',
          description: 'Supercharge your fitness journey by accelerating muscle recovery after workouts.',
          benefits: ['Muscle recovery', 'Reduces soreness', 'Amino acids', 'Athletic performance'],
          pricing: [{ label: 'Per session', price: '$179' }],
          popular: false,
          tier: 'upgrade'
        },
        {
          id: 'energy-boost',
          name: 'Energy Boost',
          tagline: 'Upgrade Tier',
          description: 'Refresh with an invigorating blend that sustains your energy throughout the day.',
          benefits: ['Sustained energy', 'Mental clarity', 'B vitamins', 'No crash'],
          pricing: [{ label: 'Per session', price: '$179' }],
          popular: true,
          tier: 'upgrade'
        },
        {
          id: 'meyers-cocktail',
          name: 'Meyer\'s Cocktail',
          tagline: 'Advanced Tier',
          description: 'A time-tested blend that alleviates chronic ailments and brings your health back into balance.',
          benefits: ['Chronic fatigue relief', 'Migraine support', 'Balanced formula', 'Proven effective'],
          pricing: [{ label: 'Per session', price: '$199' }],
          popular: true,
          tier: 'advanced'
        },
        {
          id: 'physique-boost',
          name: 'Physique Boost',
          tagline: 'Advanced Tier',
          description: 'Jumpstart your weight loss goals by revving up your body\'s natural fat-burning processes.',
          benefits: ['Metabolism boost', 'Fat burning', 'Lipo nutrients', 'Weight loss support'],
          pricing: [{ label: 'Per session', price: '$199' }],
          popular: true,
          tier: 'advanced'
        },
        {
          id: 'overall-boost',
          name: 'Overall Boost',
          tagline: 'Advanced Tier',
          description: 'Unlock your body\'s full potential by optimizing your overall vitality and well-being.',
          benefits: ['Complete wellness', 'Full spectrum', 'Optimal health', 'Total rejuvenation'],
          pricing: [{ label: 'Per session', price: '$199' }],
          popular: false,
          tier: 'advanced'
        },
        {
          id: 'high-dose-vitamin-c',
          name: 'High Dose Vitamin C',
          tagline: 'High Dose Drip',
          description: 'Powerful antioxidant therapy with concentrated Vitamin C for immune support and wellness.',
          benefits: ['Powerful antioxidant', 'Immune booster', 'Collagen support', 'Cellular health'],
          pricing: [
            { label: '10g infusion', price: '$179' },
            { label: '20g infusion', price: '$219' },
          ],
          popular: false,
          tier: 'high-dose'
        },
        {
          id: 'glutathione',
          name: 'Glutathione',
          tagline: 'High Dose Drip',
          description: 'The master antioxidant for detoxification, skin brightening, and cellular protection.',
          benefits: ['Master antioxidant', 'Skin brightening', 'Detoxification', 'Anti-aging'],
          pricing: [
            { label: '1200mg infusion', price: '$179' },
            { label: '2000mg infusion', price: '$219' },
          ],
          popular: true,
          tier: 'high-dose'
        },
        {
          id: 'nad-therapy',
          name: 'NAD+ Therapy',
          tagline: 'Cellular Energy',
          description: 'Boost cellular energy and support healthy aging with NAD+ infusion therapy.',
          benefits: ['Cellular energy', 'Mental clarity', 'Anti-aging', 'Brain function'],
          pricing: [
            { label: '250mg infusion', price: '$400' },
            { label: '500mg infusion', price: '$550' },
            { label: '1000mg infusion', price: '$700' },
          ],
          popular: true,
          tier: 'premium'
        },
      ]
    },
    'vitamin-boosters': {
      title: 'Vitamin Boosters',
      description: 'Quick vitamin injections for targeted health benefits and enhanced well-being.',
      items: [
        {
          id: 'b12',
          name: 'Vitamin B12',
          tagline: 'Energy & Focus',
          description: 'Essential vitamin for energy production, brain function, and red blood cell formation.',
          benefits: ['Boosts energy', 'Mental clarity', 'Mood support', 'Quick injection'],
          pricing: [{ label: 'Per injection', price: '$15' }],
          popular: true
        },
        {
          id: 'b-complex',
          name: 'B-Complex',
          tagline: 'Complete B Vitamins',
          description: 'Full spectrum of B vitamins for metabolism, energy, and nervous system support.',
          benefits: ['All B vitamins', 'Metabolism', 'Nerve health', 'Energy production'],
          pricing: [{ label: 'Per injection', price: '$20' }],
          popular: true
        },
        {
          id: 'vitamin-d',
          name: 'Vitamin D',
          tagline: 'Sunshine Vitamin',
          description: 'Essential for bone health, immune function, and mood regulation.',
          benefits: ['Bone health', 'Immune support', 'Mood booster', 'Hormone balance'],
          pricing: [{ label: 'Per injection', price: '$20' }],
          popular: false
        },
        {
          id: 'lipo-c',
          name: 'Lipo-C',
          tagline: 'Fat Metabolism',
          description: 'Lipotropic injection to support your body\'s natural fat-burning processes.',
          benefits: ['Fat metabolism', 'Liver support', 'Energy boost', 'Weight loss aid'],
          pricing: [{ label: 'Per month', price: '$20' }],
          popular: true
        },
        {
          id: 'immune-boost-shot',
          name: 'Immune Boost Shot',
          tagline: 'Quick Defense',
          description: 'Fast-acting immune support injection to keep you healthy and resilient.',
          benefits: ['Immune support', 'Cold & flu defense', 'Quick protection', 'Vitamin blend'],
          pricing: [{ label: 'Per injection', price: '$20' }],
          popular: false
        },
      ]
    },
    'hormone': {
      title: 'Hormone Therapy',
      description: 'Bioidentical hormone replacement therapy to restore balance and vitality.',
      items: [
        {
          id: 'bhrt-women',
          name: 'Women\'s BHRT',
          tagline: 'Hormone Balance',
          description: 'Bioidentical hormone replacement therapy to address hormonal imbalances, reduce fatigue, and improve quality of life.',
          benefits: ['Reduces fatigue', 'Mood stability', 'Better sleep', 'Increased energy'],
          pricing: [{ label: 'Monthly (plus medication)', price: '$50' }],
          popular: true
        },
        {
          id: 'bhrt-men',
          name: 'Men\'s BHRT',
          tagline: 'Testosterone Therapy',
          description: 'Testosterone replacement therapy to restore energy, strength, and vitality.',
          benefits: ['Increased energy', 'Muscle support', 'Libido boost', 'Mental clarity'],
          pricing: [{ label: 'Monthly (plus medication)', price: '$50' }],
          popular: true
        },
        {
          id: 'hormone-panel',
          name: 'Hormone Lab Panel',
          tagline: 'Comprehensive Testing',
          description: 'Complete hormone panel to assess your current levels and guide treatment.',
          benefits: ['Full hormone panel', 'Accurate baseline', 'Treatment guidance', 'Health insights'],
          pricing: [{ label: 'Male hormone panel', price: '$220' }],
          popular: false
        },
      ]
    },
    'body': {
      title: 'Body Contouring & Aesthetics',
      description: 'Non-invasive treatments for body sculpting and aesthetic enhancement.',
      items: [
        {
          id: 'emsculpt-neo',
          name: 'Emsculpt Neo',
          tagline: 'Build Muscle + Burn Fat',
          description: 'Revolutionary non-invasive treatment that simultaneously burns fat and builds muscle using RF and HIFEM technology.',
          benefits: ['Burns fat', 'Builds muscle', 'No downtime', '30-minute sessions'],
          pricing: [
            { label: 'Per session', price: '$850' },
            { label: '4-treatment package', price: '$3,400' },
          ],
          popular: true,
          featured: true
        },
        {
          id: 'latisse',
          name: 'Latisse',
          tagline: 'Lash Growth',
          description: 'FDA-approved treatment for longer, fuller, darker eyelashes.',
          benefits: ['Longer lashes', 'Fuller lashes', 'Darker lashes', 'FDA-approved'],
          pricing: [{ label: 'Per bottle', price: '$120' }],
          popular: false
        },
      ]
    }
  };

  const currentServices = services[activeCategory];

  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Services</h1>
        <p style={styles.pageSubtitle}>HYDR801 Infusion & Wellness</p>
      </header>

      {/* Category Tabs */}
      <div style={styles.categoryTabs}>
        {categories.map(cat => (
          <button
            key={cat.id}
            style={{
              ...styles.categoryTab,
              ...(activeCategory === cat.id ? styles.categoryTabActive : {})
            }}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span style={styles.categoryIcon}>{cat.icon}</span>
            <span style={styles.categoryName}>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Category Header */}
      <div style={styles.categoryHeader}>
        <h2 style={styles.categoryTitle}>{currentServices.title}</h2>
        <p style={styles.categoryDescription}>{currentServices.description}</p>
      </div>

      {/* Services List */}
      <div style={styles.servicesList}>
        {currentServices.items.map((service) => (
          <div 
            key={service.id} 
            style={{
              ...styles.serviceCard,
              ...(service.featured ? styles.serviceCardFeatured : {})
            }}
            className="card-hover"
            onClick={() => setActiveModal(service.id)}
          >
            {service.popular && <span style={styles.popularBadge}>Popular</span>}
            {service.tier && (
              <span style={{
                ...styles.tierBadge,
                background: service.tier === 'premium' ? '#9B7E9B' : 
                           service.tier === 'advanced' ? '#3B7D3B' :
                           service.tier === 'upgrade' ? '#26A69A' :
                           service.tier === 'high-dose' ? '#C4956A' : '#E8EDE6'
              }}>
                {service.tier === 'premium' ? '⭐ Premium' : 
                 service.tier === 'advanced' ? '🔷 Advanced' :
                 service.tier === 'upgrade' ? '⬆️ Upgrade' :
                 service.tier === 'high-dose' ? '💪 High Dose' : service.tier}
              </span>
            )}
            <h3 style={styles.serviceName}>{service.name}</h3>
            <p style={styles.serviceTagline}>{service.tagline}</p>
            <p style={styles.serviceDescription}>{service.description}</p>
            
            <div style={styles.serviceBenefits}>
              {service.benefits.slice(0, 3).map((benefit, idx) => (
                <span key={idx} style={styles.serviceBenefit}>✓ {benefit}</span>
              ))}
            </div>

            <div style={styles.servicePricing}>
              {service.pricing.slice(0, 2).map((price, idx) => (
                <div key={idx} style={styles.priceRow}>
                  <span style={styles.priceLabel}>{price.label}</span>
                  <span style={styles.priceValue}>{price.price}</span>
                </div>
              ))}
              {service.pricing.length > 2 && (
                <span style={styles.morePricing}>+{service.pricing.length - 2} more options</span>
              )}
            </div>

            <button style={styles.serviceBtn}>Learn More →</button>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div style={styles.contactCTA}>
        <p style={styles.contactText}>Questions about our services?</p>
        <a href="tel:801-917-4386" style={styles.contactPhone}>📞 801-917-4386</a>
        <p style={styles.contactLocation}>📍 West Haven & South Ogden, UT</p>
      </div>
    </div>
  );
}

// Profile Screen
function ProfileScreen({ user, setUser }) {
  const [showWeightLog, setShowWeightLog] = useState(false);

  const menuItems = [
    { icon: '👤', label: 'Personal Information' },
    { icon: '📊', label: 'Progress & Metrics' },
    { icon: '🎯', label: 'Goals & Preferences' },
    { icon: '💊', label: 'My Treatments' },
    { icon: '📱', label: 'Notifications' },
    { icon: '❓', label: 'Help & Support' },
  ];

  const badges = [
    { id: 'first_workout', name: 'First Workout', icon: '🏃', earned: user.badges?.includes('first_workout') },
    { id: 'protein_champion', name: 'Protein Champion', icon: '🥩', earned: user.badges?.includes('protein_champion') },
    { id: 'hydration_hero', name: 'Hydration Hero', icon: '💧', earned: user.badges?.includes('hydration_hero') },
    { id: '7_day_streak', name: '7-Day Streak', icon: '🔥', earned: user.badges?.includes('7_day_streak') },
    { id: '14_day_streak', name: '14-Day Streak', icon: '⚡', earned: user.badges?.includes('14_day_streak') },
    { id: 'meal_master', name: 'Meal Master', icon: '🍽️', earned: user.badges?.includes('meal_master') },
  ];

  const weightLoss = user.weightLog?.length >= 2
    ? (user.weightLog[0].weight - user.weightLog[user.weightLog.length - 1].weight).toFixed(1)
    : 0;

  return (
    <div style={styles.screenContent} className="fade-in">
      <header style={styles.profileHeader}>
        <div style={styles.avatar}>
          <span style={styles.avatarText}>{user.name[0]}</span>
        </div>
        <h1 style={styles.profileName}>{user.name}</h1>
        <p style={styles.profileJourney}>Week {user.week} of your journey</p>
        
        {/* Level Badge */}
        <div style={styles.levelBadgeProfile}>
          <span style={styles.levelBadgeIcon}>⭐</span>
          <span style={styles.levelBadgeText}>{user.level || 'Bronze'} Level</span>
          <span style={styles.levelBadgePoints}>{user.totalPoints || 0} pts</span>
        </div>
      </header>

      {/* Streak & Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statItem}>
          <span style={styles.statValue}>🔥 {user.currentStreak || 0}</span>
          <span style={styles.statLabel}>Day Streak</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statValue}>{weightLoss}</span>
          <span style={styles.statLabel}>lbs Lost</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statValue}>{user.longestStreak || 0}</span>
          <span style={styles.statLabel}>Best Streak</span>
        </div>
      </div>

      {/* Weight Log Section */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Weight Progress</h3>
          <button style={styles.addButton} onClick={() => setShowWeightLog(!showWeightLog)}>
            {showWeightLog ? 'Hide' : '+ Log'}
          </button>
        </div>
        
        {showWeightLog && (
          <div style={styles.weightLogInput}>
            <input 
              type="number" 
              placeholder="Enter weight (lbs)"
              style={styles.weightInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  const newLog = {
                    date: new Date().toISOString().split('T')[0],
                    weight: parseFloat(e.target.value)
                  };
                  setUser({
                    ...user,
                    weightLog: [...(user.weightLog || []), newLog]
                  });
                  e.target.value = '';
                  setShowWeightLog(false);
                }
              }}
            />
            <p style={styles.weightInputHint}>Press Enter to save</p>
          </div>
        )}

        <div style={styles.weightChart}>
          {user.weightLog?.slice(-5).map((entry, idx) => {
            const maxWeight = Math.max(...user.weightLog.slice(-5).map(e => e.weight));
            const minWeight = Math.min(...user.weightLog.slice(-5).map(e => e.weight));
            const range = maxWeight - minWeight || 1;
            const height = ((entry.weight - minWeight) / range) * 60 + 20;
            
            return (
              <div key={idx} style={styles.weightChartPoint}>
                <div style={{...styles.weightChartBar, height: `${height}%`}} />
                <span style={styles.weightChartValue}>{entry.weight}</span>
                <span style={styles.weightChartDate}>
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Badges Section */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Badges Earned</h3>
        <div style={styles.badgesGrid}>
          {badges.map((badge, idx) => (
            <div 
              key={idx} 
              style={{
                ...styles.badgeCard,
                opacity: badge.earned ? 1 : 0.4
              }}
            >
              <span style={styles.badgeIcon}>{badge.icon}</span>
              <span style={styles.badgeName}>{badge.name}</span>
              {badge.earned && <span style={styles.badgeCheck}>✓</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Provider Connection */}
      <section style={styles.section}>
        <div style={styles.providerCard}>
          <div style={styles.providerCardIcon}>🩺</div>
          <div style={styles.providerCardInfo}>
            <p style={styles.providerCardTitle}>Connected to Provider</p>
            <p style={styles.providerCardText}>Your progress is shared with Dr. Williams</p>
            <p style={styles.providerCardAppt}>Next appointment: {user.nextAppointment || 'Not scheduled'}</p>
          </div>
        </div>
      </section>

      <div style={styles.menuList}>
        {menuItems.map((item, idx) => (
          <div key={idx} style={styles.menuItem} className="card-hover">
            <span style={styles.menuIcon}>{item.icon}</span>
            <span style={styles.menuLabel}>{item.label}</span>
            <span style={styles.menuArrow}>›</span>
          </div>
        ))}
      </div>

      <button style={styles.signOutButton}>Sign Out</button>
    </div>
  );
}

// Modal Component
function Modal({ activeModal, setActiveModal }) {
  // All services data for modals
  const allServices = {
    semaglutide: {
      title: 'Semaglutide',
      subtitle: 'GLP-1 Weight Loss',
      description: 'Semaglutide is an FDA-approved GLP-1 receptor agonist that helps control appetite, reduce cravings, and regulate blood sugar levels. It works by mimicking the GLP-1 hormone, which slows gastric emptying and increases feelings of fullness.',
      benefits: [
        'Reduces appetite and controls cravings',
        'Helps regulate blood sugar levels',
        'Weekly self-administered injection',
        'Proven effective for sustainable weight loss',
        'Supports muscle preservation with proper nutrition'
      ],
      pricing: 'Initial consult + first month: $300 | Monthly: $200-$300'
    },
    tirzepatide: {
      title: 'Tirzepatide',
      subtitle: 'Dual-Action GLP-1/GIP',
      description: 'Tirzepatide is a next-generation weight loss medication that targets both GLP-1 and GIP receptors for enhanced results. This dual-action approach can lead to superior weight loss compared to single-receptor medications.',
      benefits: [
        'Dual hormone action for enhanced results',
        'Superior weight loss potential',
        'Improved metabolic function',
        'Weekly self-administered injection',
        'May be more effective for some patients'
      ],
      pricing: 'Initial consult: $300 | Monthly: $200-$475 (dose dependent)'
    },
    phentermine: {
      title: 'Phentermine',
      subtitle: 'Appetite Suppressant',
      description: 'Phentermine is a proven appetite suppressant that helps control hunger signals and supports your weight loss journey. It\'s typically used for short-term weight management.',
      benefits: [
        'Effective appetite suppression',
        'Boosts energy levels',
        'Daily oral medication',
        'Affordable option'
      ],
      pricing: '$40/month'
    },
    'immunity-boost': {
      title: 'Immunity Boost IV',
      subtitle: 'Improvement Tier - $149',
      description: 'Fortify your body\'s defenses with our immunity-focused IV infusion. Packed with vitamin C, zinc, and other immune-supporting nutrients delivered directly to your bloodstream for maximum absorption.',
      benefits: [
        'Boosts immune system function',
        'Helps fight off illness',
        'High-dose Vitamin C',
        'Zinc and antioxidants',
        '1000cc saline base for hydration'
      ],
      pricing: '$149 per session'
    },
    'gut-boost': {
      title: 'Gut Boost IV',
      subtitle: 'Improvement Tier - $149',
      description: 'Repair and heal your gut lining with our specialized gut health IV infusion. Essential nutrients support digestive wellness and reduce inflammation.',
      benefits: [
        'Supports gut lining repair',
        'Reduces digestive inflammation',
        'Improves nutrient absorption',
        'Healing amino acids and minerals'
      ],
      pricing: '$149 per session'
    },
    'detox-boost': {
      title: 'Detox Boost IV',
      subtitle: 'Improvement Tier - $149',
      description: 'Cleanse and rejuvenate with our detoxification IV blend. Formulated to help flush out toxins and impurities while supporting liver function.',
      benefits: [
        'Flushes toxins from the body',
        'Supports liver function',
        'Contains glutathione',
        'Rejuvenating antioxidants'
      ],
      pricing: '$149 per session'
    },
    'beauty-boost': {
      title: 'Beauty Boost IV',
      subtitle: 'Upgrade Tier - $179',
      description: 'Our luxurious beauty blend strengthens hair, improves skin health, and reduces inflammation for a radiant glow from the inside out.',
      benefits: [
        'Promotes glowing, healthy skin',
        'Strengthens hair and nails',
        'Contains biotin and collagen support',
        'Anti-inflammatory nutrients'
      ],
      pricing: '$179 per session'
    },
    'recovery-boost': {
      title: 'Recovery Boost IV',
      subtitle: 'Upgrade Tier - $179',
      description: 'Supercharge your fitness journey with our recovery-focused IV infusion. Accelerates muscle recovery and reduces soreness after intense workouts.',
      benefits: [
        'Faster muscle recovery',
        'Reduces post-workout soreness',
        'Essential amino acids',
        'Enhances athletic performance'
      ],
      pricing: '$179 per session'
    },
    'energy-boost': {
      title: 'Energy Boost IV',
      subtitle: 'Upgrade Tier - $179',
      description: 'Refresh and recharge with our energy-focused IV blend. Provides sustained energy throughout the day without the crash of caffeine.',
      benefits: [
        'Sustained energy levels',
        'Enhanced mental clarity',
        'B vitamins complex',
        'No crash or jitters'
      ],
      pricing: '$179 per session'
    },
    'meyers-cocktail': {
      title: 'Meyer\'s Cocktail',
      subtitle: 'Advanced Tier - $199',
      description: 'The original and time-tested IV therapy blend. The Meyer\'s Cocktail has been used for decades to alleviate chronic ailments and restore health balance.',
      benefits: [
        'Relieves chronic fatigue',
        'Supports migraine management',
        'Balanced vitamin formula',
        'Proven effective over decades'
      ],
      pricing: '$199 per session'
    },
    'physique-boost': {
      title: 'Physique Boost IV',
      subtitle: 'Advanced Tier - $199',
      description: 'Jumpstart your weight loss goals with our physique-focused IV infusion. Helps rev up your body\'s natural fat-burning processes.',
      benefits: [
        'Boosts metabolism',
        'Supports fat burning',
        'Contains lipotropic nutrients',
        'Complements weight loss programs'
      ],
      pricing: '$199 per session'
    },
    'overall-boost': {
      title: 'Overall Boost IV',
      subtitle: 'Advanced Tier - $199',
      description: 'Unlock your body\'s full potential with our comprehensive wellness IV. Optimizes overall vitality and well-being with a full spectrum of nutrients.',
      benefits: [
        'Complete wellness support',
        'Full spectrum nutrients',
        'Optimal health promotion',
        'Total body rejuvenation'
      ],
      pricing: '$199 per session'
    },
    'high-dose-vitamin-c': {
      title: 'High Dose Vitamin C',
      subtitle: 'High Dose Drip',
      description: 'Powerful antioxidant therapy with concentrated Vitamin C. Supports immune function, collagen production, and cellular health.',
      benefits: [
        'Powerful antioxidant protection',
        'Boosts immune system',
        'Supports collagen production',
        'Promotes cellular health'
      ],
      pricing: '10g: $179 | 20g: $219'
    },
    glutathione: {
      title: 'Glutathione',
      subtitle: 'Master Antioxidant',
      description: 'Glutathione is known as the "master antioxidant" for its powerful detoxification properties. Also popular for skin brightening and anti-aging benefits.',
      benefits: [
        'Most powerful antioxidant',
        'Skin brightening effects',
        'Supports detoxification',
        'Anti-aging properties'
      ],
      pricing: '1200mg: $179 | 2000mg: $219'
    },
    'nad-therapy': {
      title: 'NAD+ Therapy',
      subtitle: 'Cellular Energy',
      description: 'NAD+ is a coenzyme essential for cellular energy production. Levels naturally decline with age, and supplementation can support metabolic health, mental clarity, and overall vitality.',
      benefits: [
        'Boosts cellular energy production',
        'Supports mental clarity and focus',
        'Promotes healthy aging',
        'May enhance exercise endurance'
      ],
      pricing: '250mg: $400 | 500mg: $550 | 1000mg: $700'
    },
    b12: {
      title: 'Vitamin B12',
      subtitle: 'Energy & Focus',
      description: 'Vitamin B12 is essential for energy production, brain function, and red blood cell formation. Quick injection for immediate absorption.',
      benefits: [
        'Boosts energy naturally',
        'Enhances mental clarity',
        'Supports mood balance',
        'Quick and easy injection'
      ],
      pricing: '$15 per injection'
    },
    'b-complex': {
      title: 'B-Complex',
      subtitle: 'Complete B Vitamins',
      description: 'Full spectrum of B vitamins in one injection. Supports metabolism, energy production, and nervous system health.',
      benefits: [
        'All essential B vitamins',
        'Supports metabolism',
        'Promotes nerve health',
        'Enhances energy production'
      ],
      pricing: '$20 per injection'
    },
    'vitamin-d': {
      title: 'Vitamin D',
      subtitle: 'Sunshine Vitamin',
      description: 'Vitamin D is essential for bone health, immune function, and mood regulation. Especially important for those with limited sun exposure.',
      benefits: [
        'Supports bone health',
        'Boosts immune function',
        'Improves mood',
        'Helps hormone balance'
      ],
      pricing: '$20 per injection'
    },
    'lipo-c': {
      title: 'Lipo-C Injections',
      subtitle: 'Fat Metabolism Support',
      description: 'Lipo-C combines lipotropic compounds that support liver function and fat metabolism. This can complement your GLP-1 treatment by optimizing your body\'s fat-burning processes.',
      benefits: [
        'Supports healthy fat metabolism',
        'Promotes liver health and detoxification',
        'May boost energy levels',
        'Enhances overall metabolic function'
      ],
      pricing: '$20/month'
    },
    'immune-boost-shot': {
      title: 'Immune Boost Shot',
      subtitle: 'Quick Defense',
      description: 'Fast-acting immune support injection to help keep you healthy during cold and flu season or when you feel something coming on.',
      benefits: [
        'Quick immune support',
        'Cold & flu defense',
        'Fast protection',
        'Vitamin blend'
      ],
      pricing: '$20 per injection'
    },
    'bhrt-women': {
      title: 'Women\'s BHRT',
      subtitle: 'Hormone Balance',
      description: 'Bioidentical Hormone Replacement Therapy uses hormones identical to those your body produces naturally. Helps address symptoms like fatigue, weight gain, mood swings, and reduced libido.',
      benefits: [
        'Reduces fatigue and increases energy',
        'Improves mood stability',
        'Better sleep quality',
        'Supports healthy weight management'
      ],
      pricing: '$50/month (plus medication cost)'
    },
    'bhrt-men': {
      title: 'Men\'s Testosterone Therapy',
      subtitle: 'Hormone Optimization',
      description: 'Testosterone replacement therapy to restore optimal hormone levels. Helps address symptoms like low energy, reduced muscle mass, and decreased libido.',
      benefits: [
        'Increased energy and vitality',
        'Supports muscle mass',
        'Improves libido',
        'Enhanced mental clarity'
      ],
      pricing: '$50/month (plus medication cost)'
    },
    'hormone-panel': {
      title: 'Hormone Lab Panel',
      subtitle: 'Comprehensive Testing',
      description: 'Complete hormone panel to assess your current levels and establish a baseline for treatment. Essential for personalized hormone therapy.',
      benefits: [
        'Full hormone panel',
        'Accurate baseline levels',
        'Guides treatment decisions',
        'Health insights'
      ],
      pricing: 'Male Hormone Panel: $220'
    },
    'emsculpt-neo': {
      title: 'Emsculpt Neo',
      subtitle: 'Build Muscle + Burn Fat',
      description: 'Emsculpt Neo is a revolutionary non-invasive body contouring treatment that simultaneously burns fat and builds muscle using RF (radiofrequency) and HIFEM (High-Intensity Focused Electromagnetic) technology. Perfect for abs, glutes, arms, and legs.',
      benefits: [
        'Burns fat while building muscle',
        'Non-invasive with no downtime',
        '30-minute treatment sessions',
        'Results in 4 treatments',
        'Tones abs, lifts glutes, sculpts arms/legs'
      ],
      pricing: 'Per session: $850 | 4-treatment package: $3,400'
    },
    latisse: {
      title: 'Latisse',
      subtitle: 'Lash Growth Serum',
      description: 'Latisse is an FDA-approved prescription treatment for inadequate or sparse eyelashes. Grow longer, fuller, and darker lashes with consistent use.',
      benefits: [
        'Longer eyelashes',
        'Fuller lash appearance',
        'Darker lashes',
        'FDA-approved'
      ],
      pricing: '$120 per bottle'
    },
    // Legacy support for old modal IDs
    sermorelin: {
      title: 'Sermorelin Therapy',
      subtitle: 'Growth Hormone Support',
      description: 'Sermorelin is a growth hormone-releasing peptide that stimulates your body\'s natural production of growth hormone. This supports muscle preservation during weight loss—a key concern for GLP-1 patients.',
      benefits: [
        'Preserves lean muscle mass during weight loss',
        'Supports faster recovery from workouts',
        'May improve sleep quality and energy levels',
        'Promotes healthy body composition'
      ],
      pricing: 'Contact us for pricing'
    },
    nad: {
      title: 'NAD+ Therapy',
      subtitle: 'Cellular Energy',
      description: 'NAD+ is a coenzyme essential for cellular energy production. Levels naturally decline with age, and supplementation can support metabolic health, mental clarity, and overall vitality.',
      benefits: [
        'Boosts cellular energy production',
        'Supports mental clarity and focus',
        'Promotes healthy aging at the cellular level',
        'May enhance exercise endurance'
      ],
      pricing: '250mg: $400 | 500mg: $550 | 1000mg: $700'
    },
    lipoc: {
      title: 'Lipo-C Injections',
      subtitle: 'Fat Metabolism Support',
      description: 'Lipo-C combines lipotropic compounds that support liver function and fat metabolism. This can complement your GLP-1 treatment by optimizing your body\'s fat-burning processes.',
      benefits: [
        'Supports healthy fat metabolism',
        'Promotes liver health and detoxification',
        'May boost energy levels',
        'Enhances overall metabolic function'
      ],
      pricing: '$20/month'
    }
  };

  const data = allServices[activeModal];
  if (!data) return null;

  return (
    <div style={styles.modalOverlay} onClick={() => setActiveModal(null)}>
      <div style={styles.modalContent} className="slide-up" onClick={e => e.stopPropagation()}>
        <button style={styles.modalClose} onClick={() => setActiveModal(null)}>×</button>
        <span style={styles.modalSubtitle}>{data.subtitle}</span>
        <h2 style={styles.modalTitle}>{data.title}</h2>
        <p style={styles.modalDescription}>{data.description}</p>
        
        <div style={styles.modalBenefits}>
          <h4 style={styles.benefitsTitle}>Key Benefits</h4>
          {data.benefits.map((benefit, idx) => (
            <div key={idx} style={styles.benefitItem}>
              <span style={styles.benefitCheck}>✓</span>
              <span style={styles.benefitText}>{benefit}</span>
            </div>
          ))}
        </div>

        <div style={styles.modalFooter}>
          <span style={styles.modalPrice}>{data.pricing}</span>
          <button style={styles.primaryButton} className="btn-primary">
            Book Consultation
          </button>
          <a href="tel:801-917-4386" style={styles.modalPhoneLink}>
            Or call 801-917-4386
          </a>
        </div>
      </div>
    </div>
  );
}

// Bottom Navigation
function BottomNav({ currentScreen, setCurrentScreen }) {
  const items = [
    { id: 'home', icon: <HomeIcon />, label: 'Home' },
    { id: 'nutrition', icon: <NutritionIcon />, label: 'Nutrition' },
    { id: 'fitness', icon: <FitnessIcon />, label: 'Fitness' },
    { id: 'treatments', icon: <TreatmentIcon />, label: 'Treatments' },
    { id: 'profile', icon: <ProfileIcon />, label: 'Profile' },
  ];

  return (
    <nav style={styles.bottomNav}>
      {items.map(item => (
        <button
          key={item.id}
          style={{
            ...styles.navButton,
            color: currentScreen === item.id ? '#3B7D3B' : '#9B9B9B'
          }}
          onClick={() => setCurrentScreen(item.id)}
          className="nav-item"
        >
          {React.cloneElement(item.icon, { 
            color: currentScreen === item.id ? '#3B7D3B' : '#9B9B9B' 
          })}
          <span style={styles.navLabel}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

// Icons
function HomeIcon({ color = '#9B9B9B' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function NutritionIcon({ color = '#9B9B9B' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 8 6 8 12C8 18 12 22 12 22C12 22 16 18 16 12C16 6 12 2 12 2Z" stroke={color} strokeWidth="2"/>
      <path d="M12 22V12" stroke={color} strokeWidth="2"/>
    </svg>
  );
}

function FitnessIcon({ color = '#9B9B9B' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M6 12H18M4 8H6V16H4V8ZM18 8H20V16H18V8Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function TreatmentIcon({ color = '#9B9B9B' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 8V16M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    </svg>
  );
}

function ProfileIcon({ color = '#9B9B9B' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/>
      <path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function WaterIcon({ color = '#26A69A' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L5 10C5 14 7 17 10 17C13 17 15 14 15 10L10 2Z" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

function ProteinIcon({ color = '#3B7D3B' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="6" stroke={color} strokeWidth="1.5"/>
      <circle cx="10" cy="10" r="2" fill={color}/>
    </svg>
  );
}

function FiberIcon({ color = '#C4956A' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3V17M6 7C6 7 8 5 10 5C12 5 14 7 14 7M5 12C5 12 7 14 10 14C13 14 15 12 15 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ExerciseIcon({ color = '#9B7E9B' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 10H16M2 7H4V13H2V7ZM16 7H18V13H16V7Z" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Styles
const styles = {
  appContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #F5F4F2 0%, #EAE8E4 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: "'DM Sans', sans-serif",
  },
  
  // Mode Toggle
  modeToggle: {
    display: 'flex',
    gap: '10px',
    marginBottom: '16px',
  },
  modeBtn: {
    padding: '10px 20px',
    borderRadius: '25px',
    border: '2px solid #E0E0E0',
    background: '#FFFFFF',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  modeBtnActive: {
    borderColor: '#3B7D3B',
    background: '#3B7D3B',
    color: '#FFFFFF',
  },
  phoneFrame: {
    width: '100%',
    maxWidth: '390px',
    height: '844px',
    background: '#FAF9F7',
    borderRadius: '40px',
    overflow: 'hidden',
    boxShadow: '0 25px 80px rgba(0,0,0,0.15), 0 10px 30px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  screen: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  screenContent: {
    padding: '24px 20px',
    paddingBottom: '100px',
  },
  
  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
  },
  brandHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  brandName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#3B7D3B',
    letterSpacing: '1px',
  },
  greeting: {
    fontSize: '14px',
    color: '#8B8B8B',
    marginBottom: '4px',
    fontWeight: '400',
  },
  userName: {
    fontFamily: "'Fraunces', serif",
    fontSize: '28px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  weekBadge: {
    background: '#E8EDE6',
    borderRadius: '12px',
    padding: '8px 14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  weekLabel: {
    fontSize: '11px',
    color: '#6B6B6B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  weekNumber: {
    fontFamily: "'Fraunces', serif",
    fontSize: '20px',
    fontWeight: '600',
    color: '#3B7D3B',
  },
  
  // Hero Card
  heroCard: {
    background: 'linear-gradient(135deg, #3B7D3B 0%, #5B7B50 100%)',
    borderRadius: '20px',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  heroContent: {
    flex: 1,
  },
  heroSubtitle: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  heroTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: '8px',
  },
  heroText: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: '1.5',
    maxWidth: '200px',
  },
  heroImagePlaceholder: {
    width: '80px',
    height: '80px',
  },
  
  // Sections
  section: {
    marginBottom: '28px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '18px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '16px',
  },
  addButton: {
    background: 'none',
    border: '1px solid #E0E0E0',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '13px',
    color: '#3B7D3B',
    cursor: 'pointer',
    marginBottom: '16px',
  },
  
  // Goals Grid
  goalsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  goalCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '16px',
    cursor: 'pointer',
  },
  goalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  goalIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalPercentage: {
    fontSize: '13px',
    fontWeight: '600',
  },
  goalProgress: {
    marginBottom: '12px',
  },
  progressBar: {
    height: '6px',
    background: '#F0EFED',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
  },
  goalLabel: {
    fontSize: '13px',
    color: '#6B6B6B',
    marginBottom: '2px',
  },
  goalValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  goalUnit: {
    fontSize: '13px',
    fontWeight: '400',
    color: '#9B9B9B',
  },
  
  // Treatment Preview
  treatmentPreview: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  treatmentPreviewContent: {
    flex: 1,
  },
  treatmentTag: {
    fontSize: '11px',
    color: '#C4956A',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
    display: 'block',
  },
  treatmentPreviewTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '17px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  treatmentPreviewText: {
    fontSize: '13px',
    color: '#8B8B8B',
  },
  treatmentArrow: {
    fontSize: '20px',
    color: '#3B7D3B',
  },
  
  // Page Header
  pageHeader: {
    marginBottom: '24px',
  },
  pageTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '28px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  pageSubtitle: {
    fontSize: '14px',
    color: '#8B8B8B',
  },
  
  // Macro Overview
  macroOverview: {
    display: 'flex',
    justifyContent: 'space-around',
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '24px',
  },
  macroCircle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  macroCircleContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    marginTop: '-10px',
  },
  macroValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2D2D2D',
    display: 'block',
  },
  macroUnit: {
    fontSize: '11px',
    color: '#9B9B9B',
  },
  macroLabel: {
    fontSize: '12px',
    color: '#6B6B6B',
    marginTop: '8px',
  },
  
  // Enhanced Macro Overview - Protein Focused
  macroOverviewEnhanced: {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px 16px',
    marginBottom: '20px',
  },
  proteinHighlight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  proteinCircleOuter: {
    position: 'relative',
    width: '140px',
    height: '140px',
  },
  proteinInner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  proteinValue: {
    fontSize: '36px',
    fontWeight: '600',
    color: '#3B7D3B',
  },
  proteinUnit: {
    fontSize: '16px',
    color: '#3B7D3B',
    marginLeft: '2px',
  },
  proteinLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginTop: '8px',
  },
  proteinGoal: {
    fontSize: '13px',
    color: '#8B8B8B',
    marginTop: '2px',
  },
  secondaryMacros: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
  },
  secondaryMacroCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  secondaryMacroCircle: {
    position: 'relative',
    width: '70px',
    height: '70px',
  },
  secondaryMacroValue: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  secondaryMacroLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginTop: '6px',
  },
  secondaryMacroGoal: {
    fontSize: '11px',
    color: '#8B8B8B',
    marginTop: '2px',
  },
  dailySummaryEnhanced: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px 12px',
    marginBottom: '20px',
  },
  summaryItemProtein: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1.2,
  },
  summaryValueProtein: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '600',
    color: '#3B7D3B',
  },
  summaryLabelProtein: {
    fontSize: '10px',
    fontWeight: '600',
    color: '#3B7D3B',
    letterSpacing: '0.5px',
  },
  
  // Meals
  mealsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  mealCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer',
  },
  mealTime: {
    fontSize: '12px',
    color: '#9B9B9B',
    width: '60px',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  mealMacros: {
    fontSize: '13px',
    color: '#6B6B6B',
  },
  mealPrompt: {
    fontSize: '13px',
    color: '#C4956A',
  },
  mealStatus: {
    width: '28px',
    height: '28px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#3B7D3B',
  },
  
  // Tips
  tipsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  tipCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
  },
  tipIcon: {
    fontSize: '24px',
  },
  tipTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  tipDesc: {
    fontSize: '13px',
    color: '#8B8B8B',
    lineHeight: '1.4',
  },

  // Meal Plan Prompt
  mealPlanPrompt: {
    textAlign: 'center',
    padding: '20px 10px',
    marginBottom: '24px',
  },
  mealPlanBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'linear-gradient(135deg, #3B7D3B 0%, #5B7B50 100%)',
    borderRadius: '20px',
    padding: '6px 14px',
    marginBottom: '20px',
  },
  mealPlanBadgeIcon: {
    fontSize: '14px',
  },
  mealPlanBadgeText: {
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '500',
  },
  mealPlanIllustration: {
    marginBottom: '20px',
  },
  mealPlanTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '10px',
  },
  mealPlanDesc: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  mealPlanFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '24px',
  },
  mealPlanFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '12px 16px',
  },
  mpFeatureIcon: {
    fontSize: '20px',
  },
  mpFeatureText: {
    fontSize: '14px',
    color: '#2D2D2D',
  },

  // Day Selector
  daySelector: {
    display: 'flex',
    gap: '6px',
    marginBottom: '16px',
    overflowX: 'auto',
    paddingBottom: '4px',
  },
  daySelectorBtn: {
    background: '#F5F4F2',
    border: 'none',
    borderRadius: '20px',
    padding: '8px 14px',
    fontSize: '13px',
    color: '#6B6B6B',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  daySelectorBtnActive: {
    background: '#3B7D3B',
    color: '#FFFFFF',
  },

  // Daily Summary
  dailySummary: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '20px',
    gap: '20px',
  },
  summaryItem: {
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#3B7D3B',
    display: 'block',
  },
  summaryLabel: {
    fontSize: '11px',
    color: '#9B9B9B',
    textTransform: 'uppercase',
  },
  summaryDivider: {
    width: '1px',
    height: '30px',
    background: '#E8E8E8',
  },

  // Meal Plan List
  mealPlanList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mealPlanCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  mealPlanCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px',
    cursor: 'pointer',
  },
  mealTimeIcon: {
    fontSize: '24px',
    width: '44px',
    height: '44px',
    background: '#F5F4F2',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealPlanCardInfo: {
    flex: 1,
  },
  mealPlanType: {
    fontSize: '11px',
    color: '#9B9B9B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  mealPlanName: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  mealPlanMacros: {
    fontSize: '12px',
    color: '#6B6B6B',
  },
  mealExpandIcon: {
    fontSize: '20px',
    color: '#9B9B9B',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealPlanDetails: {
    padding: '0 16px 16px',
    borderTop: '1px solid #F0EFED',
  },
  mealDescription: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.5',
    marginTop: '12px',
    marginBottom: '12px',
  },
  ingredientsList: {
    marginBottom: '12px',
  },
  ingredientsTitle: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '6px',
  },
  ingredientItem: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.6',
  },
  instructionsList: {
    marginBottom: '12px',
  },
  instructionsTitle: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '6px',
  },
  instructionsText: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.5',
  },
  glp1TipBox: {
    display: 'flex',
    gap: '10px',
    background: '#F5F8F4',
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '12px',
  },
  glp1TipIcon: {
    fontSize: '16px',
  },
  glp1TipText: {
    fontSize: '13px',
    color: '#3B7D3B',
    lineHeight: '1.4',
  },
  logMealButton: {
    width: '100%',
    background: '#3B7D3B',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '8px',
  },
  logMealButtonLogged: {
    background: '#E8EDE6',
    color: '#3B7D3B',
  },

  // Snacks
  snackList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  snackCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px',
  },
  snackEmoji: {
    fontSize: '24px',
  },
  snackInfo: {
    flex: 1,
  },
  snackName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  snackMacros: {
    fontSize: '12px',
    color: '#9B9B9B',
  },

  // Hydration Reminder
  hydrationReminder: {
    display: 'flex',
    gap: '14px',
    background: '#E8F4F8',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '20px',
  },
  hydrationIcon: {
    fontSize: '24px',
  },
  hydrationContent: {
    flex: 1,
  },
  hydrationTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#4A8BA8',
    marginBottom: '4px',
  },
  hydrationText: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.4',
  },

  // Edit Preferences Button
  editPrefsButton: {
    width: '100%',
    background: 'transparent',
    border: '1px solid #E0E0E0',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '14px',
    color: '#6B6B6B',
    cursor: 'pointer',
    marginBottom: '20px',
  },

  // Meal Plan Setup Styles
  mpSetupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  mpProgressDots: {
    display: 'flex',
    gap: '8px',
  },
  mpProgressDot: {
    width: '8px',
    height: '8px',
    borderRadius: '4px',
    background: '#E0E0E0',
  },
  mpProgressDotActive: {
    background: '#3B7D3B',
  },
  mpStepTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '8px',
  },
  mpStepSubtitle: {
    fontSize: '14px',
    color: '#6B6B6B',
    marginBottom: '24px',
  },
  mpOptionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  },
  mpOptionCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    textAlign: 'center',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s',
  },
  mpOptionCardSelected: {
    borderColor: '#3B7D3B',
    background: '#F5F8F4',
  },
  mpOptionIcon: {
    fontSize: '32px',
    marginBottom: '8px',
    display: 'block',
  },
  mpOptionName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  mpOptionDesc: {
    fontSize: '11px',
    color: '#9B9B9B',
  },
  mpChipGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '24px',
  },
  mpChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#FFFFFF',
    borderRadius: '24px',
    padding: '10px 16px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s',
    fontSize: '14px',
    color: '#2D2D2D',
  },
  mpChipSelected: {
    borderColor: '#3B7D3B',
    background: '#F5F8F4',
  },
  mpDislikesSection: {
    marginBottom: '24px',
  },
  mpDislikesLabel: {
    fontSize: '14px',
    color: '#6B6B6B',
    marginBottom: '10px',
  },
  mpTextInput: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #E0E0E0',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
  },
  mpCookingOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '24px',
  },
  mpCookingOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 16px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s',
  },
  mpCookingOptionSelected: {
    borderColor: '#3B7D3B',
    background: '#F5F8F4',
  },
  mpCookingIcon: {
    fontSize: '20px',
  },
  mpCookingName: {
    fontSize: '14px',
    color: '#2D2D2D',
  },
  mpMealCountSection: {
    marginBottom: '24px',
  },
  mpMealCountRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '12px',
  },
  mpMealCountLabel: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  mpMealCountHint: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  mpCounter: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  mpCounterBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '18px',
    border: '1px solid #E0E0E0',
    background: '#FFFFFF',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3B7D3B',
  },
  mpCounterValue: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2D2D2D',
    minWidth: '24px',
    textAlign: 'center',
  },
  mpSummaryBox: {
    background: '#F5F8F4',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '24px',
  },
  mpSummaryTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#3B7D3B',
    marginBottom: '12px',
  },
  mpSummaryItem: {
    fontSize: '13px',
    color: '#4B4B4B',
    marginBottom: '6px',
  },
  mpGenerating: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  mpGeneratingSpinner: {
    fontSize: '48px',
    marginBottom: '16px',
    display: 'inline-block',
  },
  mpGeneratingText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '8px',
  },
  mpGeneratingSubtext: {
    fontSize: '13px',
    color: '#9B9B9B',
  },

  // ==================== ONBOARDING STYLES ====================
  onboardingContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '24px 20px',
    background: '#FAF9F7',
  },
  onboardingProgress: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  onboardingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '4px',
    background: '#E0E0E0',
    transition: 'all 0.3s',
  },
  onboardingDotActive: {
    background: '#3B7D3B',
    width: '24px',
  },
  skipButton: {
    position: 'absolute',
    top: '24px',
    right: '20px',
    background: 'none',
    border: 'none',
    color: '#9B9B9B',
    fontSize: '14px',
    cursor: 'pointer',
  },
  onboardingContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px 0',
  },
  onboardingImage: {
    marginBottom: '24px',
  },
  onboardingIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    display: 'block',
  },
  onboardingTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '26px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '8px',
  },
  onboardingSubtitle: {
    fontSize: '16px',
    color: '#3B7D3B',
    marginBottom: '16px',
  },
  onboardingDesc: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.6',
    maxWidth: '300px',
  },
  onboardingNav: {
    padding: '20px 0',
  },

  // ==================== PROVIDER STYLES ====================
  providerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  providerName: {
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  providerAvatar: {
    fontSize: '40px',
  },
  providerStatsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    background: 'linear-gradient(135deg, #3B7D3B 0%, #5B7B50 100%)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
  },
  providerStat: {
    textAlign: 'center',
  },
  providerStatValue: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#FFFFFF',
    display: 'block',
  },
  providerStatLabel: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
  },
  alertsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  alertCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFF5F0',
    borderRadius: '12px',
    padding: '14px',
  },
  alertIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '16px',
    background: '#FFCCBC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#E57373',
    fontWeight: '600',
  },
  alertContent: {
    flex: 1,
  },
  alertPatient: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  alertText: {
    fontSize: '12px',
    color: '#6B6B6B',
  },
  alertAction: {
    background: '#FFFFFF',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  appointmentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  appointmentCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px',
  },
  appointmentTime: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#3B7D3B',
    minWidth: '70px',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  appointmentType: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  appointmentBtn: {
    background: '#E8EDE6',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '12px',
    color: '#3B7D3B',
    cursor: 'pointer',
  },
  noAppointments: {
    textAlign: 'center',
    color: '#9B9B9B',
    padding: '20px',
    fontSize: '14px',
  },
  viewAllBtn: {
    background: 'none',
    border: 'none',
    color: '#3B7D3B',
    fontSize: '13px',
    cursor: 'pointer',
  },
  patientMiniList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  patientMiniCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '14px',
  },
  pmcHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  pmcAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #3B7D3B 0%, #5B7B50 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontWeight: '500',
  },
  pmcInfo: {
    flex: 1,
  },
  pmcName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  pmcWeek: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  pmcAlertBadge: {
    width: '20px',
    height: '20px',
    borderRadius: '10px',
    background: '#E57373',
    color: '#FFFFFF',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pmcStats: {
    display: 'flex',
    justifyContent: 'space-around',
    borderTop: '1px solid #F0EFED',
    paddingTop: '12px',
  },
  pmcStatItem: {
    textAlign: 'center',
  },
  pmcStatValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
    display: 'block',
  },
  pmcStatLabel: {
    fontSize: '10px',
    color: '#9B9B9B',
    textTransform: 'uppercase',
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
  },
  quickActionCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 8px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  qaIcon: {
    fontSize: '24px',
    display: 'block',
    marginBottom: '6px',
  },
  qaLabel: {
    fontSize: '11px',
    color: '#6B6B6B',
  },

  // Patient List
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '20px',
  },
  searchIcon: {
    fontSize: '16px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  patientList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  patientListCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '14px',
    cursor: 'pointer',
  },
  plcAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '22px',
    background: 'linear-gradient(135deg, #3B7D3B 0%, #5B7B50 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontSize: '18px',
    fontWeight: '500',
  },
  plcInfo: {
    flex: 1,
  },
  plcName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  plcMeta: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  plcRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  plcCompliance: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '500',
  },
  plcAlert: {
    fontSize: '14px',
  },

  // Patient Detail
  patientDetailHeader: {
    marginBottom: '16px',
  },
  patientProfile: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  pdAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '40px',
    background: 'linear-gradient(135deg, #3B7D3B 0%, #5B7B50 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontSize: '32px',
    fontWeight: '500',
    margin: '0 auto 16px',
  },
  pdName: {
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  pdMeta: {
    fontSize: '14px',
    color: '#9B9B9B',
  },
  pdAlerts: {
    marginTop: '12px',
  },
  pdAlertItem: {
    background: '#FFF5F0',
    color: '#C4956A',
    fontSize: '12px',
    padding: '8px 12px',
    borderRadius: '8px',
    marginBottom: '6px',
  },
  pdTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    overflowX: 'auto',
  },
  pdTab: {
    background: '#F5F4F2',
    border: 'none',
    borderRadius: '20px',
    padding: '8px 16px',
    fontSize: '13px',
    color: '#6B6B6B',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  pdTabActive: {
    background: '#3B7D3B',
    color: '#FFFFFF',
  },
  pdMetricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginBottom: '20px',
  },
  pdMetricCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
  },
  pdMetricValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#3B7D3B',
    display: 'block',
  },
  pdMetricLabel: {
    fontSize: '11px',
    color: '#9B9B9B',
    textTransform: 'uppercase',
  },
  pdChartCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '20px',
  },
  pdChartTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '16px',
  },
  pdChart: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '120px',
  },
  pdChartBar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  pdChartBarFill: {
    width: '24px',
    borderRadius: '4px',
    transition: 'height 0.3s',
  },
  pdChartLabel: {
    fontSize: '11px',
    color: '#9B9B9B',
  },
  pdActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  pdActionBtn: {
    flex: 1,
    minWidth: '100px',
    background: '#FFFFFF',
    border: '1px solid #E0E0E0',
    borderRadius: '10px',
    padding: '12px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  pdWeightChart: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
  },
  weightChartContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '150px',
  },
  weightPoint: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  weightBar: {
    width: '8px',
    background: '#3B7D3B',
    borderRadius: '4px',
  },
  weightValue: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  weightDate: {
    fontSize: '10px',
    color: '#9B9B9B',
  },
  pdNutritionStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  nutritionStatCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px',
  },
  nutritionStatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
  },
  nutritionPercent: {
    color: '#3B7D3B',
  },
  nutritionBar: {
    height: '8px',
    background: '#F0EFED',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '6px',
  },
  nutritionBarFill: {
    height: '100%',
    borderRadius: '4px',
  },
  nutritionMeta: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  pdFitnessInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  fitnessInfoCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fitnessInfoLabel: {
    fontSize: '14px',
    color: '#6B6B6B',
  },
  fitnessInfoValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    textTransform: 'capitalize',
  },

  // Messages
  messagesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  messageCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '14px',
    cursor: 'pointer',
  },
  msgAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '22px',
    background: 'linear-gradient(135deg, #3B7D3B 0%, #5B7B50 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontWeight: '500',
  },
  msgContent: {
    flex: 1,
  },
  msgHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  msgName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  msgTime: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  msgPreview: {
    fontSize: '13px',
    color: '#6B6B6B',
  },
  msgUnread: {
    width: '10px',
    height: '10px',
    borderRadius: '5px',
    background: '#3B7D3B',
  },

  // Analytics
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  },
  analyticsCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    textAlign: 'center',
  },
  analyticsValue: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#3B7D3B',
    display: 'block',
  },
  analyticsLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#2D2D2D',
    display: 'block',
    marginBottom: '2px',
  },
  analyticsSubtext: {
    fontSize: '11px',
    color: '#9B9B9B',
  },
  complianceBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  complianceItem: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px',
  },
  complianceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  complianceLabel: {
    fontSize: '14px',
    color: '#2D2D2D',
  },
  complianceValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#3B7D3B',
  },
  complianceBar: {
    height: '8px',
    background: '#F0EFED',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  complianceBarFill: {
    height: '100%',
    borderRadius: '4px',
  },

  // Settings
  settingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  settingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 16px',
    cursor: 'pointer',
  },
  settingIcon: {
    fontSize: '20px',
  },
  settingLabel: {
    flex: 1,
    fontSize: '14px',
    color: '#2D2D2D',
  },
  settingArrow: {
    color: '#CCCCCC',
    fontSize: '18px',
  },

  // Profile Enhancements
  levelBadgeProfile: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #F5E6D3 0%, #E8D5C4 100%)',
    borderRadius: '20px',
    padding: '8px 16px',
    marginTop: '12px',
  },
  levelBadgeIcon: {
    fontSize: '16px',
  },
  levelBadgeText: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#8B6914',
  },
  levelBadgePoints: {
    fontSize: '12px',
    color: '#A08050',
  },
  weightLogInput: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '16px',
  },
  weightInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit',
    outline: 'none',
  },
  weightInputHint: {
    fontSize: '12px',
    color: '#9B9B9B',
    marginTop: '8px',
    textAlign: 'center',
  },
  weightChart: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '120px',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
  },
  weightChartPoint: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  weightChartBar: {
    width: '20px',
    background: 'linear-gradient(180deg, #3B7D3B 0%, #5B7B50 100%)',
    borderRadius: '4px',
  },
  weightChartValue: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  weightChartDate: {
    fontSize: '10px',
    color: '#9B9B9B',
  },
  badgesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
  },
  badgeCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '12px 8px',
    textAlign: 'center',
    position: 'relative',
  },
  badgeIcon: {
    fontSize: '28px',
    display: 'block',
    marginBottom: '6px',
  },
  badgeName: {
    fontSize: '10px',
    color: '#6B6B6B',
  },
  badgeCheck: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    fontSize: '10px',
    color: '#3B7D3B',
  },
  providerCard: {
    display: 'flex',
    gap: '14px',
    background: '#E8EDE6',
    borderRadius: '14px',
    padding: '16px',
  },
  providerCardIcon: {
    fontSize: '32px',
  },
  providerCardInfo: {
    flex: 1,
  },
  providerCardTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#3B7D3B',
    marginBottom: '4px',
  },
  providerCardText: {
    fontSize: '13px',
    color: '#6B6B6B',
    marginBottom: '4px',
  },
  providerCardAppt: {
    fontSize: '12px',
    color: '#3B7D3B',
  },
  
  // Assessment Prompt (updated)
  assessmentPrompt: {
    textAlign: 'center',
    padding: '20px 10px',
  },
  aiAssessmentBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'linear-gradient(135deg, #3B7D3B 0%, #5B7B50 100%)',
    borderRadius: '20px',
    padding: '6px 14px',
    marginBottom: '20px',
  },
  aiBadgeIcon: {
    fontSize: '14px',
  },
  aiBadgeText: {
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '500',
  },
  assessmentIllustration: {
    marginBottom: '20px',
  },
  assessmentTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '12px',
  },
  assessmentDesc: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.6',
    marginBottom: '24px',
    maxWidth: '300px',
    margin: '0 auto 24px',
  },
  assessmentFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  assessmentFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 16px',
  },
  featureIcon: {
    fontSize: '20px',
  },
  featureText: {
    fontSize: '14px',
    color: '#2D2D2D',
  },
  assessmentNote: {
    fontSize: '12px',
    color: '#9B9B9B',
    marginTop: '12px',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #3B7D3B 0%, #5B7B50 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '14px',
    padding: '16px 32px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
  },
  primaryButtonWhite: {
    background: '#FFFFFF',
    color: '#3B7D3B',
    border: 'none',
    borderRadius: '14px',
    padding: '16px 32px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
  },
  secondaryButton: {
    background: 'transparent',
    color: '#6B6B6B',
    border: '1px solid #E0E0E0',
    borderRadius: '14px',
    padding: '14px 32px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
    marginTop: '12px',
  },

  // Manual Assessment Styles
  manualAssessmentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  fitnessLevelCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: '#FFFFFF',
    border: 'none',
    borderRadius: '16px',
    padding: '20px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  fitnessLevelIcon: {
    fontSize: '32px',
  },
  fitnessLevelContent: {
    flex: 1,
  },
  fitnessLevelTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  fitnessLevelDesc: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.4',
  },
  fitnessLevelArrow: {
    fontSize: '18px',
    color: '#3B7D3B',
  },

  // Assessment Header
  assessmentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    fontSize: '15px',
    color: '#3B7D3B',
    cursor: 'pointer',
    padding: 0,
  },
  assessmentStageTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '18px',
    fontWeight: '500',
    color: '#2D2D2D',
  },

  // Intro Screen
  introContent: {
    padding: '0 10px',
  },
  cameraPreviewBox: {
    background: '#2D2D2D',
    borderRadius: '20px',
    height: '180px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  cameraIcon: {
    fontSize: '40px',
    marginBottom: '8px',
  },
  cameraText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
  },
  introTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '18px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '16px',
    textAlign: 'left',
  },
  exercisePreviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '24px',
  },
  exercisePreviewItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 16px',
  },
  exercisePreviewIcon: {
    fontSize: '24px',
  },
  exercisePreviewName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  exercisePreviewDuration: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  privacyNote: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#F5F4F2',
    borderRadius: '12px',
    padding: '14px 16px',
    marginBottom: '24px',
  },
  privacyIcon: {
    fontSize: '16px',
  },
  privacyText: {
    fontSize: '12px',
    color: '#6B6B6B',
    lineHeight: '1.4',
  },

  // Camera Full Screen
  cameraFullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: '#000',
    zIndex: 100,
  },
  cameraVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'scaleX(-1)', // Mirror for selfie view
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '60px 24px 40px',
  },
  exerciseProgress: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
  },
  exerciseProgressDot: {
    width: '10px',
    height: '10px',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  exerciseInfoCard: {
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '20px',
    textAlign: 'center',
  },
  exerciseNumber: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
    display: 'block',
  },
  exerciseNameLarge: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: '8px',
  },
  exerciseInstruction: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: '1.4',
  },
  centerContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startExerciseButton: {
    width: '100px',
    height: '100px',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, #3B7D3B 0%, #5B7B50 100%)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 30px rgba(74, 103, 65, 0.4)',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: '18px',
    fontWeight: '600',
  },
  positionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    marginTop: '20px',
  },
  countdownCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '60px',
    background: 'rgba(255,255,255,0.2)',
    border: '4px solid #FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownNumber: {
    fontSize: '48px',
    fontWeight: '600',
    color: '#FFFFFF',
  },
  getReadyText: {
    color: '#FFFFFF',
    fontSize: '18px',
    fontWeight: '500',
    marginTop: '20px',
  },
  recordingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(0,0,0,0.6)',
    borderRadius: '30px',
    padding: '12px 24px',
  },
  recordingDot: {
    width: '12px',
    height: '12px',
    borderRadius: '6px',
    background: '#FF4444',
    animation: 'pulse 1s ease-in-out infinite',
  },
  recordingText: {
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '500',
  },
  scanningOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '200px',
    border: '2px solid rgba(74, 103, 65, 0.5)',
    borderRadius: '20px',
    overflow: 'hidden',
  },
  scanningLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, transparent, #3B7D3B, transparent)',
  },
  analyzingSpinner: {
    width: '80px',
    height: '80px',
    borderRadius: '40px',
    background: 'rgba(74, 103, 65, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzingIcon: {
    fontSize: '36px',
  },
  analyzingText: {
    color: '#FFFFFF',
    fontSize: '16px',
    marginTop: '16px',
  },
  cancelAssessmentButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    background: 'rgba(0,0,0,0.5)',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Error Container
  errorContainer: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  errorIcon: {
    fontSize: '60px',
    marginBottom: '20px',
  },
  errorTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '12px',
  },
  errorText: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.6',
    marginBottom: '24px',
  },

  // Camera Setup
  cameraSetupContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '40px',
  },
  loadingSpinner: {
    width: '80px',
    height: '80px',
    borderRadius: '40px',
    background: '#E8EDE6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  spinnerIcon: {
    fontSize: '36px',
  },
  setupText: {
    fontSize: '16px',
    color: '#6B6B6B',
  },

  // Analyzing Screen
  analyzingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
  },
  analyzingAnimation: {
    width: '100px',
    height: '100px',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, #E8EDE6 0%, #D8E0D5 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  analyzingMainIcon: {
    fontSize: '48px',
  },
  analyzingTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '12px',
  },
  analyzingSubtext: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.6',
    marginBottom: '32px',
    maxWidth: '280px',
  },
  analysisSteps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
  },
  analysisStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 16px',
  },
  stepCheck: {
    color: '#3B7D3B',
    fontSize: '16px',
    fontWeight: '600',
  },
  stepSpinner: {
    color: '#9B9B9B',
    fontSize: '16px',
  },
  stepText: {
    fontSize: '14px',
    color: '#2D2D2D',
  },

  // Results Screen
  resultsHeader: {
    textAlign: 'center',
    marginBottom: '28px',
  },

  // Equipment Selection Styles
  equipmentIntro: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  equipmentIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  equipmentTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '8px',
  },
  equipmentSubtitle: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.5',
  },
  equipmentGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '24px',
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '4px',
  },
  equipmentCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '14px 16px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s ease',
  },
  equipmentCardSelected: {
    borderColor: '#3B7D3B',
    background: '#F5F8F4',
  },
  equipmentCardIcon: {
    fontSize: '24px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F5F4F2',
    borderRadius: '10px',
  },
  equipmentCardContent: {
    flex: 1,
  },
  equipmentCardName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '2px',
  },
  equipmentCardDesc: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  equipmentCheckbox: {
    width: '24px',
    height: '24px',
    borderRadius: '12px',
    border: '2px solid #E0E0E0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#FFFFFF',
    transition: 'all 0.2s ease',
  },
  equipmentCheckboxSelected: {
    background: '#3B7D3B',
    borderColor: '#3B7D3B',
  },
  equipmentFooter: {
    position: 'sticky',
    bottom: 0,
    background: 'linear-gradient(transparent, #FAF9F7 20%)',
    paddingTop: '20px',
  },
  equipmentNote: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#6B6B6B',
    marginBottom: '12px',
  },
  resultsBadge: {
    display: 'inline-block',
    background: '#E8EDE6',
    borderRadius: '20px',
    padding: '6px 16px',
    marginBottom: '20px',
  },
  resultsBadgeText: {
    fontSize: '12px',
    color: '#3B7D3B',
    fontWeight: '500',
  },
  scoreCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, #3B7D3B 0%, #5B7B50 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  scoreNumber: {
    fontSize: '36px',
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.8)',
  },
  levelBadge: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '8px',
  },
  summaryText: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.6',
  },
  resultsSection: {
    marginBottom: '24px',
  },
  resultsSectionTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '12px',
  },
  tagList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  strengthTag: {
    background: '#E8EDE6',
    color: '#3B7D3B',
    fontSize: '13px',
    padding: '8px 14px',
    borderRadius: '20px',
  },
  focusTag: {
    background: '#FFF5F0',
    color: '#C4956A',
    fontSize: '13px',
    padding: '8px 14px',
    borderRadius: '20px',
  },
  equipmentTag: {
    background: '#E8F4F8',
    color: '#4A8BA8',
    fontSize: '13px',
    padding: '8px 14px',
    borderRadius: '20px',
  },
  planOverview: {
    fontSize: '14px',
    color: '#6B6B6B',
    marginBottom: '12px',
  },
  workoutPreviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  workoutPreviewCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  workoutDay: {
    fontSize: '12px',
    color: '#9B9B9B',
    width: '60px',
  },
  workoutName2: {
    flex: 1,
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  workoutDuration: {
    fontSize: '12px',
    color: '#3B7D3B',
    background: '#E8EDE6',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  safetySection: {
    background: '#FFF5F0',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '24px',
  },
  safetyTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#C4956A',
    marginBottom: '8px',
  },
  safetyItem: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.6',
  },
  equipmentSuggestionSection: {
    background: '#E8F4F8',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '24px',
  },
  equipmentSuggestionTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#4A8BA8',
    marginBottom: '8px',
  },
  equipmentSuggestionItem: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.6',
  },

  // Fitness Home Screen additions
  levelCard: {
    background: 'linear-gradient(135deg, #E8EDE6 0%, #D8E0D5 100%)',
    borderRadius: '14px',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  levelLabel: {
    fontSize: '13px',
    color: '#6B6B6B',
  },
  levelValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#3B7D3B',
  },
  equipmentBadge: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '14px 16px',
    marginBottom: '20px',
  },
  equipmentBadgeLabel: {
    fontSize: '12px',
    color: '#6B6B6B',
    marginBottom: '8px',
    display: 'block',
  },
  equipmentBadgeList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  equipmentBadgeItem: {
    background: '#E8F4F8',
    color: '#4A8BA8',
    fontSize: '12px',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  exerciseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  exerciseCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    cursor: 'pointer',
  },
  exerciseIndex: {
    width: '28px',
    height: '28px',
    borderRadius: '14px',
    background: '#E8EDE6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '600',
    color: '#3B7D3B',
    flexShrink: 0,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  exerciseMeta: {
    fontSize: '13px',
    color: '#6B6B6B',
    marginBottom: '4px',
  },
  exerciseNotes: {
    fontSize: '12px',
    color: '#9B9B9B',
    fontStyle: 'italic',
  },
  exerciseEquipment: {
    fontSize: '12px',
    color: '#4A8BA8',
    marginBottom: '2px',
  },
  
  // Today's Workout
  todayWorkout: {
    background: 'linear-gradient(135deg, #3B7D3B 0%, #5B7B50 100%)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '24px',
    color: '#FFFFFF',
  },
  todayLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'block',
    marginBottom: '8px',
  },
  todayTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '500',
    marginBottom: '8px',
  },
  todayDesc: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: '16px',
    lineHeight: '1.5',
  },
  todayMeta: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  todayTag: {
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '20px',
    padding: '6px 12px',
    fontSize: '12px',
    textTransform: 'capitalize',
  },
  
  // Activity
  activityCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '20px',
  },
  activityTitle: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '20px',
  },
  activityBars: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100px',
  },
  activityDay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  activityBarContainer: {
    width: '24px',
    height: '80px',
    background: '#F0EFED',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  activityBar: {
    width: '100%',
    background: 'linear-gradient(180deg, #5B7B50 0%, #3B7D3B 100%)',
    borderRadius: '4px',
    transition: 'height 0.5s ease',
  },
  activityDayLabel: {
    fontSize: '11px',
    color: '#9B9B9B',
  },
  
  // Treatments/Services
  treatmentsIntro: {
    marginBottom: '24px',
  },
  introText: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.6',
  },
  categoryTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  categoryTab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '10px 14px',
    background: '#F5F4F2',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    minWidth: '60px',
    transition: 'all 0.2s',
  },
  categoryTabActive: {
    background: '#3B7D3B',
    color: '#FFFFFF',
  },
  categoryIcon: {
    fontSize: '18px',
  },
  categoryName: {
    fontSize: '10px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  categoryHeader: {
    marginBottom: '20px',
  },
  categoryTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '20px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '6px',
  },
  categoryDescription: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.5',
  },
  servicesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginBottom: '24px',
  },
  serviceCard: {
    background: '#FFFFFF',
    borderRadius: '18px',
    padding: '20px',
    position: 'relative',
    cursor: 'pointer',
  },
  serviceCardFeatured: {
    background: 'linear-gradient(135deg, #F5F8F4 0%, #E8EDE6 100%)',
    border: '2px solid #3B7D3B',
  },
  tierBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    color: '#FFFFFF',
    fontSize: '10px',
    fontWeight: '500',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  serviceName: {
    fontFamily: "'Fraunces', serif",
    fontSize: '18px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
    marginTop: '4px',
  },
  serviceTagline: {
    fontSize: '12px',
    color: '#3B7D3B',
    marginBottom: '10px',
    fontWeight: '500',
  },
  serviceDescription: {
    fontSize: '13px',
    color: '#6B6B6B',
    lineHeight: '1.5',
    marginBottom: '14px',
  },
  serviceBenefits: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '14px',
  },
  serviceBenefit: {
    fontSize: '11px',
    color: '#3B7D3B',
    background: '#E8EDE6',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  servicePricing: {
    background: '#F5F4F2',
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '14px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  priceLabel: {
    fontSize: '12px',
    color: '#6B6B6B',
  },
  priceValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  morePricing: {
    fontSize: '11px',
    color: '#3B7D3B',
    display: 'block',
    textAlign: 'center',
    marginTop: '6px',
  },
  serviceBtn: {
    background: 'none',
    border: 'none',
    color: '#3B7D3B',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: 0,
  },
  contactCTA: {
    textAlign: 'center',
    background: 'linear-gradient(135deg, #3B7D3B 0%, #5B7B50 100%)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
  },
  contactText: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '10px',
  },
  contactPhone: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#FFFFFF',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '8px',
  },
  contactLocation: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.8)',
  },
  treatmentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  treatmentCard: {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    position: 'relative',
    cursor: 'pointer',
  },
  popularBadge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: '#FFF5F0',
    color: '#C4956A',
    fontSize: '11px',
    fontWeight: '500',
    padding: '4px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  treatmentName: {
    fontFamily: "'Fraunces', serif",
    fontSize: '20px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  treatmentTagline: {
    fontSize: '13px',
    color: '#3B7D3B',
    marginBottom: '12px',
  },
  treatmentDescription: {
    fontSize: '14px',
    color: '#6B6B6B',
    lineHeight: '1.5',
    marginBottom: '16px',
  },
  benefitTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
  },
  benefitTag: {
    background: '#F5F4F2',
    color: '#6B6B6B',
    fontSize: '12px',
    padding: '6px 12px',
    borderRadius: '20px',
  },
  learnMoreBtn: {
    background: 'none',
    border: 'none',
    color: '#3B7D3B',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: 0,
  },
  
  // Profile
  profileHeader: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #3B7D3B 0%, #5B7B50 100%)',
    borderRadius: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  avatarText: {
    fontSize: '32px',
    fontWeight: '500',
    color: '#FFFFFF',
  },
  profileName: {
    fontFamily: "'Fraunces', serif",
    fontSize: '24px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  profileJourney: {
    fontSize: '14px',
    color: '#8B8B8B',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
    gap: '20px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#3B7D3B',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#9B9B9B',
  },
  statDivider: {
    width: '1px',
    height: '40px',
    background: '#E8E8E8',
  },
  menuList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '24px',
  },
  menuItem: {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer',
  },
  menuIcon: {
    fontSize: '20px',
  },
  menuLabel: {
    flex: 1,
    fontSize: '15px',
    color: '#2D2D2D',
  },
  menuArrow: {
    color: '#CCCCCC',
    fontSize: '20px',
  },
  signOutButton: {
    background: 'none',
    border: '1px solid #E8E8E8',
    borderRadius: '14px',
    padding: '16px',
    width: '100%',
    fontSize: '15px',
    color: '#9B9B9B',
    cursor: 'pointer',
  },
  
  // Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    background: '#FAF9F7',
    borderRadius: '24px 24px 0 0',
    padding: '32px 24px',
    maxWidth: '390px',
    width: '100%',
    maxHeight: '80vh',
    overflowY: 'auto',
    position: 'relative',
  },
  modalClose: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: '#F0EFED',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '16px',
    fontSize: '20px',
    color: '#6B6B6B',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubtitle: {
    fontSize: '12px',
    color: '#3B7D3B',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
    display: 'block',
  },
  modalTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '26px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '16px',
  },
  modalDescription: {
    fontSize: '15px',
    color: '#6B6B6B',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  modalBenefits: {
    marginBottom: '24px',
  },
  benefitsTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '16px',
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  },
  benefitCheck: {
    width: '20px',
    height: '20px',
    background: '#E8EDE6',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3B7D3B',
    fontSize: '12px',
    flexShrink: 0,
  },
  benefitText: {
    fontSize: '14px',
    color: '#4B4B4B',
    lineHeight: '1.4',
  },
  modalFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  modalPrice: {
    fontSize: '14px',
    color: '#8B8B8B',
    textAlign: 'center',
  },
  modalPhoneLink: {
    display: 'block',
    textAlign: 'center',
    color: '#3B7D3B',
    fontSize: '14px',
    marginTop: '12px',
    textDecoration: 'none',
  },
  
  // Bottom Nav
  bottomNav: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    background: '#FFFFFF',
    borderTop: '1px solid #F0EFED',
    padding: '12px 0 28px',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    padding: '8px',
  },
  navLabel: {
    fontSize: '10px',
    fontWeight: '500',
  },
};
