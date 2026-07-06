import React from "react";
import { Shield, FileText, Lock, Eye, Users, Database, Image as ImageIcon, UserCheck, RefreshCw, Mail, ChevronRight } from "lucide-react";
import SEO from "../common/SEO";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Introduction",
      icon: FileText,
      content: `Civisence ("we", "our", "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our Issue Management Dashboard.`
    },
    {
      title: "Information We Collect",
      icon: Database,
      items: [
        "Personal Information: Name, college email address, and registration details",
        "Account Data: Login credentials, OTP verification data",
        "User Content: Issues, comments, votes, and uploaded media",
        "Usage Data: Interaction with the platform, activity logs"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: Eye,
      items: [
        "To provide and maintain the platform",
        "To verify college identity and prevent unauthorized access",
        "To track and resolve reported campus issues",
        "To communicate status updates and important notifications"
      ]
    },
    {
      title: "Data Protection & Security",
      icon: Lock,
      items: [
        "We implement industry-standard encryption and security measures",
        "Your data is stored securely and access is strictly controlled",
        "We do not sell or rent your personal information to third parties"
      ]
    },
    {
      title: "Data Sharing",
      icon: Users,
      content: "Your issue reports and public comments are visible to authorized campus staff and administrators for resolution purposes. Your college email address is used strictly for internal identification and notifications."
    },
    {
      title: "Media Uploads",
      icon: ImageIcon,
      content: "Images uploaded as issue attachments are stored securely and used solely to assist staff in identifying and resolving campus infrastructure problems."
    },
    {
      title: "User Rights",
      icon: UserCheck,
      items: [
        "You have the right to access and review your personal data",
        "You may request correction of inaccurate information",
        "You may request account deletion by contacting campus administration"
      ]
    },
    {
      title: "Changes to This Policy",
      icon: RefreshCw,
      content: "We may update this Privacy Policy from time to time. Continued use of the platform constitutes acceptance of the updated policy."
    }
  ];

  return (
    <div className="min-h-screen w-full overflow-auto bg-linear-to-br from-slate-50 via-white to-violet-50/30 font-sans text-slate-800">
      <SEO
        title="Privacy Policy"
        description="Review how CiviSence collects, protects, and uses personal data within our smart campus infrastructure platform."
        keywords="CiviSence privacy policy, campus data security, student privacy, university data protection"
      />
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold tracking-wider uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
          Legal
        </div>
        
        <h1 className="text-5xl md:text-5xl font-bold text-slate-900 mb-2">
          Privacy <span className="text-violet-600">Policy</span>
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
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-slate-900 text-lg">Privacy Policy</span>
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
                              <ChevronRight className="w-4 h-4 text-violet-400 mt-1 shrink-0" />
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
                    10. Contact Us
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    If you have any questions regarding this Privacy Policy, contact us at:
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

export default PrivacyPolicy;