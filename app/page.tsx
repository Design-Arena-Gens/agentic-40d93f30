'use client';

import { useState } from 'react';

type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'pro';
type PlayStyle = 'casual' | 'competitive' | 'social';
type Location = 'north' | 'south' | 'east' | 'west' | 'central';

interface Player {
  id: number;
  name: string;
  age: number;
  skillLevel: SkillLevel;
  playStyle: PlayStyle;
  location: Location;
  availability: string[];
  matchScore: number;
}

const mockPlayers: Player[] = [
  {
    id: 1,
    name: "Sarah Chen",
    age: 28,
    skillLevel: "intermediate",
    playStyle: "competitive",
    location: "north",
    availability: ["Mon 6pm", "Wed 6pm", "Sat 10am"],
    matchScore: 0
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    age: 35,
    skillLevel: "advanced",
    playStyle: "competitive",
    location: "central",
    availability: ["Tue 7pm", "Thu 7pm", "Sun 9am"],
    matchScore: 0
  },
  {
    id: 3,
    name: "Emily Watson",
    age: 24,
    skillLevel: "intermediate",
    playStyle: "casual",
    location: "north",
    availability: ["Mon 6pm", "Sat 10am", "Sun 2pm"],
    matchScore: 0
  },
  {
    id: 4,
    name: "David Kim",
    age: 42,
    skillLevel: "intermediate",
    playStyle: "social",
    location: "east",
    availability: ["Wed 6pm", "Fri 5pm", "Sat 2pm"],
    matchScore: 0
  },
  {
    id: 5,
    name: "Jessica Park",
    age: 31,
    skillLevel: "advanced",
    playStyle: "competitive",
    location: "west",
    availability: ["Mon 7pm", "Thu 7pm", "Sat 9am"],
    matchScore: 0
  },
  {
    id: 6,
    name: "Tom Anderson",
    age: 29,
    skillLevel: "beginner",
    playStyle: "casual",
    location: "south",
    availability: ["Tue 6pm", "Thu 6pm", "Sun 10am"],
    matchScore: 0
  },
  {
    id: 7,
    name: "Lisa Martinez",
    age: 26,
    skillLevel: "intermediate",
    playStyle: "casual",
    location: "central",
    availability: ["Mon 6pm", "Wed 5pm", "Sat 11am"],
    matchScore: 0
  },
  {
    id: 8,
    name: "James Wilson",
    age: 38,
    skillLevel: "pro",
    playStyle: "competitive",
    location: "north",
    availability: ["Tue 8am", "Thu 8am", "Sat 8am"],
    matchScore: 0
  }
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('intermediate');
  const [playStyle, setPlayStyle] = useState<PlayStyle>('casual');
  const [location, setLocation] = useState<Location>('central');
  const [availability, setAvailability] = useState<string[]>([]);
  const [matches, setMatches] = useState<Player[]>([]);

  const availabilityOptions = [
    "Mon 6pm", "Tue 6pm", "Wed 6pm", "Thu 6pm", "Fri 6pm",
    "Sat 9am", "Sat 10am", "Sat 2pm", "Sun 9am", "Sun 10am", "Sun 2pm"
  ];

  const calculateMatches = () => {
    const scored = mockPlayers.map(player => {
      let score = 0;

      // Skill level match (40 points)
      if (player.skillLevel === skillLevel) score += 40;
      else if (
        (skillLevel === 'beginner' && player.skillLevel === 'intermediate') ||
        (skillLevel === 'intermediate' && (player.skillLevel === 'beginner' || player.skillLevel === 'advanced')) ||
        (skillLevel === 'advanced' && (player.skillLevel === 'intermediate' || player.skillLevel === 'pro')) ||
        (skillLevel === 'pro' && player.skillLevel === 'advanced')
      ) score += 20;

      // Play style match (20 points)
      if (player.playStyle === playStyle) score += 20;
      else if (
        (playStyle === 'casual' && player.playStyle === 'social') ||
        (playStyle === 'social' && player.playStyle === 'casual')
      ) score += 10;

      // Location match (20 points)
      if (player.location === location) score += 20;
      else if (location === 'central' || player.location === 'central') score += 10;

      // Availability overlap (20 points)
      const overlap = player.availability.filter(slot => availability.includes(slot)).length;
      score += Math.min(overlap * 7, 20);

      return { ...player, matchScore: score };
    });

    const sorted = scored.sort((a, b) => b.matchScore - a.matchScore);
    setMatches(sorted.slice(0, 6));
    setStep(3);
  };

  const toggleAvailability = (slot: string) => {
    setAvailability(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    );
  };

  const getMatchColor = (score: number) => {
    if (score >= 70) return 'bg-green-100 border-green-300';
    if (score >= 50) return 'bg-yellow-100 border-yellow-300';
    return 'bg-orange-100 border-orange-300';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 70) return 'Excellent Match';
    if (score >= 50) return 'Good Match';
    return 'Potential Match';
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎾 Tennis Partner Match</h1>
          <p className="text-gray-600">Find your perfect tennis partner</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>Profile</span>
            <span className={`text-sm font-medium ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>Availability</span>
            <span className={`text-sm font-medium ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>Matches</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Profile */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Your Profile</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Level
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['beginner', 'intermediate', 'advanced', 'pro'] as SkillLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSkillLevel(level)}
                      className={`px-4 py-3 rounded-lg border-2 font-medium capitalize transition-all ${
                        skillLevel === level
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-primary'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Play Style
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['casual', 'competitive', 'social'] as PlayStyle[]).map((style) => (
                    <button
                      key={style}
                      onClick={() => setPlayStyle(style)}
                      className={`px-4 py-3 rounded-lg border-2 font-medium capitalize transition-all ${
                        playStyle === style
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-primary'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {(['north', 'south', 'east', 'west', 'central'] as Location[]).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setLocation(loc)}
                      className={`px-4 py-3 rounded-lg border-2 font-medium capitalize transition-all ${
                        location === loc
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-primary'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="mt-8 w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Availability */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Your Availability</h2>

            <p className="text-gray-600 mb-4">Select all times you're available to play</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {availabilityOptions.map((slot) => (
                <button
                  key={slot}
                  onClick={() => toggleAvailability(slot)}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    availability.includes(slot)
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-primary'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            {availability.length === 0 && (
              <p className="text-amber-600 text-sm mb-4">
                ⚠️ Please select at least one availability slot
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={calculateMatches}
                disabled={availability.length === 0}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Find Matches
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Matches */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Your Matches</h2>
              <p className="text-gray-600">
                Found {matches.length} potential partners based on your preferences
              </p>
            </div>

            {matches.map((player) => (
              <div
                key={player.id}
                className={`bg-white rounded-lg shadow-md p-6 border-2 ${getMatchColor(player.matchScore)}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{player.name}</h3>
                    <p className="text-gray-600">{player.age} years old</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{player.matchScore}%</div>
                    <div className="text-sm font-medium text-gray-600">
                      {getMatchLabel(player.matchScore)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-500">Skill Level</span>
                    <p className="font-medium capitalize">{player.skillLevel}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Play Style</span>
                    <p className="font-medium capitalize">{player.playStyle}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Location</span>
                    <p className="font-medium capitalize">{player.location}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Overlapping Slots</span>
                    <p className="font-medium">
                      {player.availability.filter(slot => availability.includes(slot)).length}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-sm text-gray-500 block mb-2">Common Availability</span>
                  <div className="flex flex-wrap gap-2">
                    {player.availability
                      .filter(slot => availability.includes(slot))
                      .map(slot => (
                        <span
                          key={slot}
                          className="px-3 py-1 bg-primary text-white text-sm rounded-full"
                        >
                          {slot}
                        </span>
                      ))}
                    {player.availability.filter(slot => availability.includes(slot)).length === 0 && (
                      <span className="text-gray-500 text-sm">No common slots</span>
                    )}
                  </div>
                </div>

                <button className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                  Send Match Request
                </button>
              </div>
            ))}

            <button
              onClick={() => {
                setStep(1);
                setMatches([]);
              }}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Start New Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
