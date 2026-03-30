import React from "react";
import { FileText, CheckCircle, Users, Shield, AlertTriangle, Image as ImageIcon, Gavel, Copyright, Scale, Power, Mail, ChevronRight } from "lucide-react";

const TermsOfUse = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: CheckCircle,
      content: `By accessing, registering for, or using the Civisence Issue Management Dashboard ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree, you may not use the Platform.`
    },
    {
      title: "Description of Service",
      icon: FileText,
      content: `The Platform provides a centralized system for students, staff, and administrators to report, track, and resolve campus issues, including features like reporting, voting, commenting, and status tracking.`
    },
    {
      title: "User Accounts, Verification, and Privileges",
      icon: Users,
      items: [
        "Account Security: Users must use a valid college email and are responsible for safeguarding their login credentials",
        "Peer Verification: Certain features are restricted to verified users, requiring approval from three trusted users",
        "Reputation System: User contributions are tracked, and misuse may lead to penalties or loss of privileges"
      ]
    },
    {
      title: "User Conduct",
      icon: Shield,
      items: [
        "No false reporting, spam, or duplicate issues",
        "No harassment or abusive content",
        "No manipulation of votes or verification system",
        "No impersonation of others"
      ]
    },
    {
      title: "Media and Content",
      icon: ImageIcon,
      content: "Users are responsible for uploaded content. Administrators may remove any content that violates guidelines without prior notice."
    },
    {
      title: "Moderation and Enforcement",
      icon: Gavel,
      content: "The Platform allows community reporting and administrator actions, including warnings, content removal, and account bans."
    },
    {
      title: "Intellectual Property",
      icon: Copyright,
      content: "All platform content and design are owned by Civisence. Users are granted limited rights to use the platform for its intended purpose."
    },
    {
      title: "Limitation of Liability",
      icon: Scale,
      content: `The Platform is provided "as is" without guarantees of uptime or error-free service. Civisence is not liable for any damages arising from usage.`
    },
    {
      title: "Termination",
      icon: Power,
      content: "We reserve the right to suspend or terminate accounts at any time for violations of these Terms."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-white to-violet-50/30 font-sans text-slate-800">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold tracking-wider uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
          Legal
        </div>
        
        <h1 className="text-5xl md:text-5xl font-bold text-slate-900 mb-2">
          Terms <span className="text-violet-600">of Use</span>
        </h1>
        
        <p className="text-slate-500 mt-4">
          Last updated: March 11, 2026
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-200">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-slate-900 text-lg">Terms and Conditions</span>
          </div>

          {/* Sections */}
          <div className="divide-y divide-slate-100">
            {sections.map((section, index) => {
              const Icon = section.icon;
              
              return (
                <div key={index} className="px-6 py-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-violet-50 text-violet-600 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-semibold text-slate-900 mb-3">
                        {index + 1}. {section.title}
                      </h2>
                      
                      {section.content && (
                        <p className="text-slate-600 leading-relaxed">
                          {section.content}
                        </p>
                      )}
                      
                      {section.items && (
                        <ul className="space-y-2">
                          {section.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-600">
                              <ChevronRight className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Contact Section */}
            <div className="px-6 py-6 bg-slate-50/50">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-violet-100 text-violet-600 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-slate-900 mb-3">
                    10. Contact Information
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    For questions or concerns, contact us at:
                  </p>
                  <a 
                    href="mailto:civisence@gmail.com"
                    className="inline-flex items-center gap-2 text-violet-600 font-medium hover:text-violet-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    civisence@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Civisence. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;