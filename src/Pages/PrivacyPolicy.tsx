import React from "react";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-8 lg:px-16 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 shadow-xl rounded-2xl">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-6">
          Last updated: July 21, 2025
        </p>

        <p className="mb-4">
          This Privacy Policy describes the data handling practices for the web
          application
          <strong> CD Bougainvillea </strong> once full control has been
          transferred to the client (e.g., housing society or designated
          management). It outlines how user data is managed post-deployment and
          clarifies that the original developer does not hold responsibility for
          any data handling thereafter.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Interpretation and Definitions
        </h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>
            <strong>You:</strong> The individual or entity using the Service.
          </li>
          <li>
            <strong>Service:</strong> The website at{" "}
            <a
              href="https://cdbougainvillea.netlify.app"
              className="text-blue-600 underline"
            >
              https://cdbougainvillea.netlify.app
            </a>
          </li>
          <li>
            <strong>Client:</strong> The housing society or designated
            administrator who owns the platform post-deployment.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Data Collection Disclaimer
        </h2>
        <p className="mb-4">
          The original developer does{" "}
          <strong>not collect, store, or process</strong> any personal or usage
          data after deployment. The client is fully responsible for data
          ownership, management, and compliance.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Third-Party Services
        </h2>
        <p className="mb-2">The Service may use third-party tools like:</p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Firebase Authentication and Hosting</li>
          <li>Google Sign-In (optional)</li>
        </ul>
        <p className="mb-4">
          These are governed by their own policies:
          <br />
          <a
            className="text-blue-600 underline"
            href="https://firebase.google.com/support/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Firebase Privacy Policy
          </a>{" "}
          &nbsp;|&nbsp;
          <a
            className="text-blue-600 underline"
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Privacy Policy
          </a>
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Cookies and Tracking
        </h2>
        <p className="mb-4">
          No analytics or tracking is configured by the developer. Any cookies
          are for login/session only via Firebase.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Responsibility of the Client
        </h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>
            The client is responsible for all user data, permissions, and
            account management.
          </li>
          <li>
            The developer retains no admin access or liability after handover.
          </li>
          <li>
            All communication and support is handled by the client (e.g.,
            society chairman).
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Children’s Privacy</h2>
        <p className="mb-4">
          The app is not intended for users under 13. Enforcement is the
          client’s responsibility.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Data Retention & Deletion
        </h2>
        <p className="mb-4">
          The client controls all data retention and deletion policies using
          Firebase admin tools.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Security</h2>
        <p className="mb-4">
          While standard security is built-in, ongoing protection (e.g.,
          credential management) is the client’s duty.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Modifications</h2>
        <p className="mb-4">
          The client may modify this policy to meet local legal or internal
          requirements.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
        <p className="mb-4">
          For questions, users should contact the society chairman or app
          administrator.
          <br />
          Developer Contact (for delivery confirmation only):{" "}
          <strong>9359116310</strong>
        </p>

        <p className="text-sm italic text-gray-500">
          This policy only applies post-deployment of the CD Bougainvillea
          application.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
