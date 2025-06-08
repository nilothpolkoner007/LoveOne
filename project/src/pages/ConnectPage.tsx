import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Heart } from 'lucide-react';

function ConnectPage() {
  const { inviteId } = useParams();
  const navigate = useNavigate();
  const { acceptConnection, error } = useChatStore();

  useEffect(() => {
    if (inviteId) {
      handleAcceptInvite();
    }
  }, [inviteId]);

  const handleAcceptInvite = async () => {
    try {
      await acceptConnection(inviteId!);
      navigate('/chat');
    } catch (error) {
      console.error('Failed to accept invitation:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Heart className="h-12 w-12 text-rose-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {inviteId ? 'Accept Connection Request' : 'Connect with Your Partner'}
        </h1>
        <p className="text-gray-600">
          {inviteId
            ? "You're about to connect with someone special"
            : 'Choose how you want to connect with your partner'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {inviteId ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-lg text-gray-800 mb-6">
            Someone has invited you to connect on Couple Space. Click below to accept the connection request.
          </p>
          <button
            onClick={handleAcceptInvite}
            className="bg-rose-500 text-white px-8 py-3 rounded-lg hover:bg-rose-600 transition-colors"
          >
            Accept Connection Request
          </button>
        </div>
      ) : (
        <ConnectPartner />
      )}
    </div>
  );
}

export default ConnectPage;