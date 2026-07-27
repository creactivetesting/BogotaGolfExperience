"use client";

import { useEffect } from 'react';

export function AiAgentWidget() {
  useEffect(() => {
    const scriptSrc = "https://widget-v2.dapta.ai/agent.min.js?agentId=14a964f2-dee8-4abb-aeb3-d65d2368fdcc";
    
    // Check if script is already present to avoid duplicates
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return null;
}