import React from "react";

const TermsPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-8 lg:px-16 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 shadow-xl rounded-2xl">
        <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
        <p className="text-sm text-gray-500 mb-6">
          Last updated: July 21, 2025
        </p>

        <p className="mb-4">
          These Terms and Conditions govern the usage and transfer of the CD
          Bougainvillea web application. Once the app is delivered to the client
          (e.g., housing society), the developer no longer holds control or
          responsibility for its operations or content.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Acceptance of Terms</h2>
        <p className="mb-4">
          By accepting the final handover of the application, the client agrees
          to be solely responsible for all future use, maintenance, and legal
          compliance related to the app.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Transfer of Responsibility
        </h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>
            Ownership and administrative control of the platform are transferred
            to the client upon delivery.
          </li>
          <li>
            The developer relinquishes all backend/database access after
            handover.
          </li>
          <li>
            Future user management, data handling, and legal obligations rest
            with the client.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Developer Disclaimer
        </h2>
        <p className="mb-4">
          The developer is not liable for any misuse, legal violations, data
          breaches, or technical issues arising after the handover.
          Post-delivery, all issues must be addressed by the client.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          User Access and Conduct
        </h2>
        <p className="mb-4">
          The client is responsible for granting and managing access to users
          (e.g., guards, residents). They must ensure responsible usage of the
          app within their community or organization.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Third-Party Services
        </h2>
        <p className="mb-4">
          This app may integrate with third-party services like Firebase and
          Google. The client is bound by their terms of service and must ensure
          appropriate use.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Security and Updates
        </h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>The app includes basic security practices at handover.</li>
          <li>
            The client is responsible for future maintenance, updates, and
            protection of credentials.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Modifications</h2>
        <p className="mb-4">
          The client may update or modify the platform, privacy policy, or these
          terms based on their internal needs or applicable laws.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Termination</h2>
        <p className="mb-4">
          Once the application is delivered, the developer has no control over
          its continuation or termination. The client has full autonomy over its
          usage or shutdown.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
        <p className="mb-4">
          For issues related to usage or administration, users should contact
          the society chairman or admin panel operator.
          <br />
          Developer contact for delivery confirmation only:{" "}
          <strong>9359116310</strong>
        </p>

        <p className="text-sm italic text-gray-500">
          These terms apply only post-deployment and govern responsibility after
          handover to the client.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
