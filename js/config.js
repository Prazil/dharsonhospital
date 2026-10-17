/**
 * DHARSON HOSPITAL - CENTRAL CONFIGURATION & DATA REPOSITORY
 * Location: Namakkal, Tamil Nadu, India
 * Speciality: Orthopaedics / Bone & Joint Care
 * 
 * IMPORTANT: Hospital administrators can easily update contact details, 
 * doctor profiles, appointment settings, and testimonials in this single file.
 */

const HOSPITAL_CONFIG = {
  // Brand & Location Information
  brand: {
    name: "Dharson Hospital",
    tagline: "Move Better. Live Stronger.",
    speciality: "Orthopaedics & Bone Joint Care",
    district: "Namakkal",
    state: "Tamil Nadu",
    country: "India",
    pinCode: "637001", // EDITABLE_PLACEHOLDER: Replace with actual postal code
    establishedYear: "2026",
  },

  // Contact Details (EDITABLE PLACEHOLDERS - Replace with verified hospital contacts)
  contact: {
    phonePrimary: "+91 XXXXX XXXXX", // EDITABLE_PLACEHOLDER: Replace with main reception number
    phoneEmergency: "+91 XXXXX XXXXX", // EDITABLE_PLACEHOLDER: Replace with emergency / casualty line
    phoneDisplay: "+91 XXXXX XXXXX",
    emailPrimary: "info@example.com", // EDITABLE_PLACEHOLDER: Replace with hospital official email
    emailAppointments: "appointments@example.com",
    addressLine1: "Dharson Hospital",
    addressLine2: "Main Road", // EDITABLE_PLACEHOLDER: Replace with street address
    city: "Namakkal",
    state: "Tamil Nadu",
    country: "India",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Namakkal+Tamil+Nadu+India",
    workingHours: {
      weekdays: "Monday – Saturday: 9:00 AM – 6:00 PM",
      sunday: "Emergency / On-Call Support",
      opdTimings: "OPD: 9:30 AM – 1:30 PM & 4:30 PM – 7:30 PM"
    }
  },

  // Backend Integration (Google Apps Script Web App Endpoint)
  api: {
    // Paste your deployed Google Apps Script Web App URL here after deploying:
    // e.g. "https://script.google.com/macros/s/AKfycbx.../exec"
    appointmentWebhookUrl: "", 
  },

  // Trust & Care Highlights
  highlights: [
    "Advanced Orthopaedic Care",
    "Patient-Centred Approach",
    "Namakkal, Tamil Nadu"
  ],

  // Orthopaedic Treatments & Clinical Services
  treatments: [
    {
      id: "joint-replacement",
      title: "Joint Replacement",
      shortDesc: "Comprehensive care for patients requiring joint replacement evaluation and treatment.",
      fullDesc: "Evaluation and surgical care planning for advanced arthritis and joint damage in hip and knee joints, focusing on long-term mobility restoration and pain relief.",
      icon: "joint",
      commonConditions: ["Severe Knee Osteoarthritis", "Hip Joint Degeneration", "Chronic Joint Stiffness"],
      careApproach: "Pre-surgical joint assessment, patient counselling, modern prosthesis planning, and guided post-operative physical rehabilitation."
    },
    {
      id: "fracture-trauma",
      title: "Fracture & Trauma Care",
      shortDesc: "Evaluation and treatment for fractures, injuries and musculoskeletal trauma.",
      fullDesc: "Immediate assessment and treatment for acute bone fractures, dislocations, soft tissue injuries, and accidental musculoskeletal trauma.",
      icon: "trauma",
      commonConditions: ["Upper & Lower Limb Fractures", "Joint Dislocations", "Multiple Trauma Stabilisation"],
      careApproach: "Rapid clinical triage, digital imaging, conservative casting or surgical fixation, followed by progressive bone healing monitoring."
    },
    {
      id: "arthritis-joint-pain",
      title: "Arthritis & Joint Pain",
      shortDesc: "Assessment and personalised management of joint pain and arthritis.",
      fullDesc: "Evidence-informed diagnosis and multi-modality management for osteoarthritic, inflammatory, and degenerative joint pain conditions.",
      icon: "pain",
      commonConditions: ["Knee Pain", "Shoulder Impingement", "Degenerative Joint Disease"],
      careApproach: "Early stage lifestyle modification, joint injections, ergonomic guidance, physiotherapy, and medical management."
    },
    {
      id: "sports-injuries",
      title: "Sports Injuries",
      shortDesc: "Care for common sports and activity-related musculoskeletal injuries.",
      fullDesc: "Dedicated assessment and rehabilitation plans for athletes, fitness enthusiasts, and active individuals experiencing ligament tears, sprains, or muscle damage.",
      icon: "sports",
      commonConditions: ["ACL / PCL Ligament Tears", "Meniscus Injuries", "Rotator Cuff Tears", "Ankle Sprains"],
      careApproach: "Biomechanical evaluation, focused rehabilitation, arthroscopic interventions when indicated, and structured return-to-sport protocols."
    },
    {
      id: "spine-care",
      title: "Spine Care",
      shortDesc: "Evaluation and treatment planning for selected spine and back conditions.",
      fullDesc: "Structured clinical evaluation for neck pain, lumbar spine conditions, postural disorders, and nerve compression issues.",
      icon: "spine",
      commonConditions: ["Lumbar Spondylosis", "Cervical Spine Pain", "Sciatica & Disc Bulges"],
      careApproach: "Non-surgical conservative therapy, posture re-education, core strengthening, and referral for targeted interventions if necessary."
    },
    {
      id: "arthroscopy",
      title: "Arthroscopy",
      shortDesc: "Minimally invasive joint evaluation and treatment where clinically appropriate.",
      fullDesc: "Keyhole surgical techniques for diagnosing and repairing internal joint damage with smaller incisions, reduced post-operative discomfort, and faster recovery.",
      icon: "scope",
      commonConditions: ["Knee Arthroscopy", "Shoulder Arthroscopy", "Cartilage Debridement"],
      careApproach: "High-definition camera visualisation, minimal tissue disruption, and early mobility protocols."
    },
    {
      id: "paediatric-orthopaedics",
      title: "Paediatric Orthopaedics",
      shortDesc: "Orthopaedic assessment and care for children.",
      fullDesc: "Gentle, specialised musculoskeletal evaluations for growing bones, developmental variations, congenital conditions, and childhood fractures.",
      icon: "child",
      commonConditions: ["Growing Pains", "Paediatric Fractures", "Gait & Alignment Concerns"],
      careApproach: "Child-friendly consultation environment, age-appropriate treatment plans, and continuous growth monitoring."
    },
    {
      id: "general-orthopaedics",
      title: "General Orthopaedics",
      shortDesc: "Comprehensive evaluation of bone, muscle, ligament and joint conditions.",
      fullDesc: "Thorough diagnostic consultations for general musculoskeletal discomfort, osteoporosis screening, tendonitis, bursitis, and work-related strain.",
      icon: "general",
      commonConditions: ["Osteoporosis", "Carpal Tunnel Syndrome", "Tendinopathies", "Chronic Musculoskeletal Fatigue"],
      careApproach: "Holistic health assessment, bone density guidance, nutritional advice, and custom physical therapy plans."
    }
  ],

  // Hospital Facilities
  facilities: [
    {
      id: "consultation-rooms",
      title: "Consultation Rooms",
      description: "Private, comfortable clinical chambers designed for in-depth doctor consultations and patient examinations.",
      image: "assets/images/facility-consultation.jpg",
      tag: "Outpatient Care"
    },
    {
      id: "diagnostic-support",
      title: "Diagnostic Support",
      description: "Digital radiology, high-resolution X-ray review, and coordinated imaging facilities for accurate bone assessment.",
      image: "assets/images/facility-diagnostic.jpg",
      tag: "Precision Imaging"
    },
    {
      id: "procedure-areas",
      title: "Procedure / Treatment Areas",
      description: "Clean, hygienic minor procedure and treatment suites for dressing, cast application, and orthopaedic interventions.",
      image: "assets/images/facility-procedure.jpg",
      tag: "Sterile Environment"
    },
    {
      id: "patient-waiting",
      title: "Patient Waiting Areas",
      description: "Spacious, well-ventilated, air-conditioned lounges with accessible seating for patients and attending families.",
      image: "assets/images/facility-waiting.jpg",
      tag: "Comfort & Accessibility"
    },
    {
      id: "recovery-followup",
      title: "Recovery & Follow-up",
      description: "Dedicated zones for observation, mobility assessments, physical rehabilitation guidance, and follow-up reviews.",
      image: "assets/images/facility-recovery.jpg",
      tag: "Rehabilitation"
    },
    {
      id: "patient-support",
      title: "Patient Support & Desk",
      description: "Helpful front-desk administration for appointment scheduling, billing transparency, and patient assistance.",
      image: "assets/images/facility-support.jpg",
      tag: "Patient-First Service"
    }
  ],

  // Orthopaedic Medical Team (EDITABLE PLACEHOLDERS - Do not fabricate real doctor names/degrees)
  doctors: [
    {
      id: "specialist-1",
      name: "Orthopaedic Specialist", // PLACEHOLDER: Update with real doctor name
      role: "Lead Orthopaedic Consultant",
      speciality: "Joint Replacement & Trauma Care",
      qualifications: "Doctor profile details to be updated", // PLACEHOLDER: Update with degrees (e.g. MBBS, MS Ortho)
      experience: "Profile information pending verification",
      availability: "Monday – Saturday (OPD Hours)",
      isPlaceholder: true
    },
    {
      id: "specialist-2",
      name: "Orthopaedic Specialist", // PLACEHOLDER: Update with real doctor name
      role: "Orthopaedic & Arthroscopy Consultant",
      speciality: "Sports Injuries & Arthroscopic Surgery",
      qualifications: "Doctor profile details to be updated",
      experience: "Profile information pending verification",
      availability: "By Appointment",
      isPlaceholder: true
    },
    {
      id: "specialist-3",
      name: "Orthopaedic Specialist", // PLACEHOLDER: Update with real doctor name
      role: "Spine & General Orthopaedic Consultant",
      speciality: "Spine Assessment & Musculoskeletal Care",
      qualifications: "Doctor profile details to be updated",
      experience: "Profile information pending verification",
      availability: "Monday – Friday",
      isPlaceholder: true
    }
  ],

  // Patient Experiences (EDITABLE PLACEHOLDERS - No fabricated reviews)
  testimonials: [
    {
      id: "feedback-1",
      quote: "Patient feedback will appear here once verified by hospital administration.",
      patientName: "Patient Feedback Placeholder",
      location: "Namakkal",
      treatmentType: "Orthopaedic Care",
      placeholderCode: "REPLACE_WITH_REAL_TESTIMONIAL"
    },
    {
      id: "feedback-2",
      quote: "Verified patient experiences and testimonials will be published here in accordance with hospital guidelines.",
      patientName: "Patient Feedback Placeholder",
      location: "Namakkal District",
      treatmentType: "Joint Care",
      placeholderCode: "REPLACE_WITH_REAL_TESTIMONIAL"
    },
    {
      id: "feedback-3",
      quote: "We value patient trust and transparency. Authentic feedback from our orthopaedic patients will be displayed here.",
      patientName: "Patient Feedback Placeholder",
      location: "Tamil Nadu",
      treatmentType: "Fracture Recovery",
      placeholderCode: "REPLACE_WITH_REAL_TESTIMONIAL"
    }
  ],

  // Frequently Asked Questions
  faqs: [
    {
      question: "When should I see an orthopaedic specialist?",
      answer: "You should consult an orthopaedic specialist if you experience persistent joint pain, swelling, difficulty bearing weight, reduced range of motion, severe stiffness after rest, numbness or tingling in the limbs, or immediately following an acute injury, fall, or trauma."
    },
    {
      question: "What should I bring to my appointment?",
      answer: "Please bring a valid photo identification, any previous medical records, past X-rays, MRI scans or laboratory reports, a list of current medications you are taking, and details of any previous surgeries or existing health conditions."
    },
    {
      question: "Do I need to bring previous medical reports?",
      answer: "Yes, bringing past radiological imaging (X-rays, CT, MRI scans) and blood test reports is very helpful. It provides our doctors with a complete clinical history, prevents unnecessary repeat scans, and assists in accurate comparative evaluation."
    },
    {
      question: "How long does an orthopaedic consultation take?",
      answer: "An initial consultation typically takes between 20 to 40 minutes. This includes a thorough discussion of your symptoms and medical history, physical examination of the affected joint or bone, review of any diagnostic scans, and discussing recommended care pathways."
    },
    {
      question: "What happens after diagnosis?",
      answer: "After completing your clinical examination and reviewing diagnostic findings, your orthopaedic doctor will explain your condition clearly. We will outline suitable treatment avenues—ranging from conservative physical therapy and medication to minimally invasive procedures or surgical options—allowing you to make an informed decision."
    },
    {
      question: "Can I request a follow-up appointment?",
      answer: "Yes, follow-up consultations can be booked directly through our front desk, by calling the hospital, or by requesting an appointment online through this website. Regular follow-ups ensure your recovery is progressing smoothly."
    }
  ]
};

// Export for module/script usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HOSPITAL_CONFIG;
}
