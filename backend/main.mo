import Result "mo:base/Result";

import Random "mo:base/Random";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";
import Buffer "mo:base/Buffer";

actor {
    // Store last 10 rolls
    private var rollHistory = Buffer.Buffer<[Nat]>(0);
    
    // Generate random numbers between 1 and 6 for each die
    public func rollDice(numDice : Nat) : async [Nat] {
        let entropy = await Random.blob();
        var randomNumber = Random.Finite(entropy);
        
        // Create array to store results
        var results : [var Nat] = Array.init<Nat>(numDice, 1);
        
        // Generate random number for each die
        for (i in results.keys()) {
            switch (randomNumber.range(6)) {
                case (?val) {
                    results[i] := val + 1; // Add 1 since we want 1-6, not 0-5
                    randomNumber := Random.Finite(await Random.blob()); // Get new entropy for next roll
                };
                case (null) {
                    results[i] := 1; // Fallback value
                };
            };
        };
        
        let finalResults = Array.freeze(results);
        
        // Add to history, maintain only last 10 rolls
        rollHistory.add(finalResults);
        if (rollHistory.size() > 10) {
            ignore rollHistory.removeLast();
        };
        
        return finalResults;
    };

    // Get roll history
    public query func getHistory() : async [[Nat]] {
        Buffer.toArray(rollHistory)
    };
}
