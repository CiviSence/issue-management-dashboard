import React from 'react';

const CsaePolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Child Safety and CSAE Policy</h1>
      <p className="mb-4 text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Zero Tolerance Policy</h2>
        <p className="mb-4">
          At <strong>CiviSence</strong> (and the CiviSence-Admin application), we have a strict, zero-tolerance policy against Child Sexual Abuse and Exploitation (CSAE). We are committed to maintaining a safe environment for all users and strictly prohibit the generation, upload, sharing, or distribution of any content that depicts, encourages, or promotes child sexual abuse or exploitation.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Prohibited Content</h2>
        <p className="mb-4">Users of CiviSence-Admin are strictly prohibited from utilizing the platform to:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Upload, share, or link to any form of Child Sexual Abuse Material (CSAM).</li>
          <li>Engage in grooming or predatory behavior.</li>
          <li>Share or request sexual content involving minors.</li>
          <li>Distribute content that sexualizes minors.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Enforcement and Reporting</h2>
        <p className="mb-4">
          If we become aware of any content or behavior that violates this policy, we will take immediate action, which includes but is not limited to:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Immediate removal of the offending content.</li>
          <li>Permanent suspension and termination of the offending user's account.</li>
          <li>Reporting the incident, user details, and content to the National Center for Missing and Exploited Children (NCMEC) and relevant law enforcement authorities.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Reporting Violations</h2>
        <p className="mb-4">
          If you encounter any content or behavior on the CiviSence platform that you believe violates this policy, please report it immediately.
          You can contact our support and moderation team directly. If you believe a child is in immediate danger, please contact your local law enforcement.
        </p>
      </section>
    </div>
  );
};

export default CsaePolicy;
