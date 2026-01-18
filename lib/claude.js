export async function askClaude(messages) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: messages
      })
    });

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Claude API Error:', error);
    return 'I apologize, but I encountered an error. Please try again.';
  }
}

export const POA_QUESTIONS = [
  // PRINCIPAL
  {
    field: "principal_name",
    question: "What is the full legal name of the Principal (the person granting the Power of Attorney)?",
    example: "Example: John Michael Smith"
  },
  {
    field: "principal_address",
    question: "What is the Principal’s complete address?",
    example: "Example: 123 Main Street, Los Angeles, CA 90012"
  },

  // AGENT
  {
    field: "agent_name",
    question: "Who would you like to appoint as your Agent (Attorney-in-Fact)? Please provide their full legal name.",
    example: "Example: Sarah Elizabeth Smith"
  },
  {
    field: "agent_address",
    question: "What is the Agent’s complete address?",
    example: "Example: 456 Oak Avenue, San Francisco, CA 94102"
  },
  {
    field: "agent_relationship",
    question: "What is the Agent’s relationship to the Principal?",
    example: "Example: spouse, daughter, trusted friend"
  },

  // SUCCESSOR AGENT
  {
    field: "successor_agent",
    question: "Would you like to name a Successor Agent? If yes, type their full name. If no, type 'none'.",
    example: "Example: Michael Robert Smith or none"
  },

  // CORE POA STRUCTURE
  {
    field: "durable",
    question: "Should this Power of Attorney be DURABLE (remain effective if you become incapacitated)? Answer Yes or No.",
    example: "Example: Yes"
  },
  {
    field: "effective_when",
    question: "When should this Power of Attorney become effective? Type: immediately OR upon_incapacity",
    example: "Example: immediately"
  },

  // POWERS (YES/NO per category)
  {
    field: "powers_real_estate",
    question: "Grant the Agent authority over REAL ESTATE transactions? (buy/sell/refinance/manage) Yes or No.",
    example: "Example: Yes"
  },
  {
    field: "powers_banking",
    question: "Grant the Agent authority over BANKING and financial institution transactions? Yes or No.",
    example: "Example: Yes"
  },
  {
    field: "powers_tax",
    question: "Grant the Agent authority to handle TAX matters? Yes or No.",
    example: "Example: No"
  },

  // HOT POWER
  {
    field: "hot_gifts",
    question: "Authorize the Agent to MAKE GIFTS of your property or money? (special power) Yes or No.",
    example: "Example: No"
  },

  // REAL ESTATE RECORDING
  {
    field: "record_for_real_estate",
    question: "If you granted real estate powers, do you intend to RECORD this POA for real estate transactions? Yes or No.",
    example: "Example: Yes"
  },

  // SPECIAL INSTRUCTIONS
  {
    field: "special_instructions",
    question: "Any special instructions or limitations you want included? If none, type 'none'.",
    example: "Example: Agent may not sell the family home / none"
  }
];
