import React, { useEffect, useRef } from 'react';

const ConsciousnessFractal = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    let time = 0;
    let chaos = { x: 0.1, y: 0.1, z: 0.1 };
    let convergingInputs = [];
    let validatedPatterns = [];
    let circuits = [];
    let energyPulses = [];
    let brainClouds = [];
    let expandingCells = []; // NEW: Cellular bubbles
    let nextSpawn = 60;
    let nextAngle = 0;
    let brainFormed = false;
    let brainFormationProgress = 0;
    let systemCapacity = 1.0;
    let apertureSize = 1.0;
    
    let fieldCoherence = 0;
    let fieldResonance = [];
    let collectiveBreath = 0;

    const updateChaos = (state) => {
      const dt = 0.005;
      const sigma = 10, rho = 28, beta = 8/3;
      const dx = sigma * (state.y - state.x) * dt;
      const dy = (state.x * (rho - state.z) - state.y) * dt;
      const dz = (state.x * state.y - beta * state.z) * dt;
      return {
        x: state.x + dx,
        y: state.y + dy,
        z: state.z + dz
      };
    };

    const checkBrainFormation = () => {
      const centerRadius = 120;
      const patternsInCenter = validatedPatterns.filter(p => {
        const dist = p.baseLength * p.scale;
        return dist < centerRadius;
      }).length;
      
      return patternsInCenter >= 15;
    };

    const calculateFieldCoherence = () => {
      if (!brainFormed || brainClouds.length === 0) return 0;
      
      let totalConnections = 0;
      let synchronizedConnections = 0;
      
      brainClouds.forEach(cloud => {
        cloud.connectedPatterns.forEach(pattern => {
          totalConnections++;
          const phaseDiff = Math.abs(Math.sin(time * 0.02 + cloud.phaseOffset) - 
                                     Math.sin(time * 0.02 + pattern.phaseOffset));
          if (phaseDiff < 0.3) synchronizedConnections++;
        });
      });
      
      return totalConnections > 0 ? synchronizedConnections / totalConnections : 0;
    };

    const generateFieldResonance = () => {
      if (!brainFormed) return [];
      
      const resonances = [];
      const numResonances = Math.floor(fieldCoherence * 8);
      
      for (let i = 0; i < numResonances; i++) {
        const frequency = (i + 1) * 0.015;
        const amplitude = Math.sin(time * frequency) * fieldCoherence * 30;
        const angle = (i / numResonances) * Math.PI * 2;
        
        resonances.push({
          angle,
          amplitude,
          frequency,
          phase: time * frequency
        });
      }
      
      return resonances;
    };

    // NEW: Expanding Cell class for cellular regeneration
    class ExpandingCell {
      constructor(sourceCloud, birthTime) {
        this.sourceCloud = sourceCloud;
        this.birthTime = birthTime;
        this.age = 0;
        
        // Start at cloud position
        this.angle = sourceCloud.angle + (Math.random() - 0.5) * 0.3;
        this.distance = sourceCloud.distance;
        this.hue = sourceCloud.hue + (Math.random() - 0.5) * 20;
        
        // Expansion properties
        this.expansionSpeed = 0.6 + Math.random() * 0.4;
        this.maxRadius = 12 + Math.random() * 18;
        this.currentRadius = 0;
        
        // Lifecycle phases: birth (0-1), growth (1-2), mature (2-3), decay (3-4)
        this.lifecycle = 0;
        this.lifecycleSpeed = 0.006 + Math.random() * 0.003;
        
        this.phaseOffset = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.015;
        this.rotation = 0;
        
        // Fractal properties
        this.fractalSeed = Math.random() * 4 - 2;
        this.fractalComplexity = 3 + Math.floor(Math.random() * 3); // 3-5 iterations
      }

      update() {
        this.age++;
        this.lifecycle += this.lifecycleSpeed;
        
        // Expand outward from cloud
        this.distance += this.expansionSpeed;
        
        // Lifecycle-based radius growth
        if (this.lifecycle < 1) {
          // Birth phase: rapid growth
          this.currentRadius = this.maxRadius * this.lifecycle;
        } else if (this.lifecycle < 2) {
          // Growth phase: reach full size
          this.currentRadius = this.maxRadius;
        } else if (this.lifecycle < 3) {
          // Mature phase: stable
          this.currentRadius = this.maxRadius * (1 + Math.sin(this.age * 0.05) * 0.1);
        } else {
          // Decay phase: shrink and fade
          const decayProgress = (this.lifecycle - 3);
          this.currentRadius = this.maxRadius * (1 - decayProgress);
        }
        
        this.rotation += this.rotationSpeed;
        
        // Calculate screen position
        this.x = centerX + Math.cos(this.angle) * this.distance;
        this.y = centerY + Math.sin(this.angle) * this.distance;
        
        // Die if too old or too far
        return this.lifecycle < 4 && this.distance < Math.max(width, height);
      }

      drawFractalBranch(ctx, x, y, length, angle, depth, hue, alpha) {
        if (depth === 0 || length < 0.5) return;
        
        const endX = x + length * Math.cos(angle);
        const endY = y + length * Math.sin(angle);
        
        // Draw branch
        ctx.strokeStyle = `hsla(${hue}, 75%, 60%, ${alpha * (depth / this.fractalComplexity)})`;
        ctx.lineWidth = Math.max(0.3, depth * 0.5);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Recursive branching with slight randomness
        const branchAngle = Math.PI / 4 + this.fractalSeed * 0.2;
        const lengthMult = 0.65;
        
        this.drawFractalBranch(ctx, endX, endY, length * lengthMult, angle - branchAngle, depth - 1, hue + 5, alpha);
        this.drawFractalBranch(ctx, endX, endY, length * lengthMult, angle + branchAngle, depth - 1, hue - 5, alpha);
        
        // Occasionally add middle branch for complexity
        if (depth > 2 && Math.abs(this.fractalSeed) > 0.5) {
          this.drawFractalBranch(ctx, endX, endY, length * lengthMult * 0.8, angle, depth - 1, hue, alpha);
        }
      }

      draw(ctx) {
        if (this.currentRadius < 0.5) return;
        
        // Calculate alpha based on lifecycle
        let alpha;
        if (this.lifecycle < 1) {
          // Fading in
          alpha = this.lifecycle * 0.4;
        } else if (this.lifecycle < 3) {
          // Full visibility
          alpha = 0.4;
        } else {
          // Fading out
          const decayProgress = (this.lifecycle - 3);
          alpha = 0.4 * (1 - decayProgress);
        }
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Draw fractal pattern with multiple starting branches
        const numBranches = 4 + Math.floor(Math.random() * 3); // 4-6 main branches
        for (let i = 0; i < numBranches; i++) {
          const angle = (i / numBranches) * Math.PI * 2;
          const branchLength = this.currentRadius * 0.5;
          this.drawFractalBranch(ctx, 0, 0, branchLength, angle, this.fractalComplexity, this.hue, alpha);
        }
        
        // Central glow
        const glowSize = this.currentRadius * 0.15;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${this.hue}, 90%, 70%, ${alpha * 0.6})`;
        ctx.fillStyle = `hsla(${this.hue}, 85%, 75%, ${alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.restore();
      }
    }

    class BrainCloud {
      constructor(angle, distance, birthTime) {
        this.angle = angle;
        this.baseDistance = distance;
        this.distance = distance;
        this.birthTime = birthTime;
        this.phaseOffset = Math.random() * Math.PI * 2;
        this.hue = 200 + Math.random() * 60;
        this.baseHue = this.hue; // Remember original hue
        this.attractedToHue = null; // SRL rainbow lock target
        this.lockStrength = 0; // How locked onto a wavelength we are
        this.alpha = 0;
        this.particles = [];
        this.connectedPatterns = [];
        this.energyLevel = 0;
        
        for (let i = 0; i < 20; i++) {
          this.particles.push({
            angle: angle + (Math.random() - 0.5) * 0.8,
            distOffset: (Math.random() - 0.5) * 50,
            size: 2 + Math.random() * 4,
            phaseOffset: Math.random() * Math.PI * 2,
            speed: 0.002 + Math.random() * 0.003,
            energy: Math.random(),
            targetPattern: null,
            excitement: 0
          });
        }
      }

      update(time, allPatterns, globalBreath, convergingInputs, expandingCells) {
        const age = time - this.birthTime;
        
        if (age < 60) {
          this.alpha = age / 60;
        } else {
          this.alpha = Math.min(0.7, this.alpha);
        }
        
        const localWave = Math.sin(time * 0.01 + this.phaseOffset) * 10;
        const breathWave = globalBreath * 20;
        this.distance = this.baseDistance + localWave + breathWave;
        
        // SRL RAINBOW LOCK: Scan for packets with matching wavelengths
        let nearbyPackets = [];
        let matchingPackets = [];
        
        if (convergingInputs && convergingInputs.length > 0) {
          convergingInputs.forEach(input => {
            if (!input || input.x === undefined || input.y === undefined) return;
            
            const inputAngle = Math.atan2(input.y - centerY, input.x - centerX);
            let angleDiff = Math.abs(inputAngle - this.angle);
            if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
            
            if (angleDiff < Math.PI / 3) {
              nearbyPackets.push({
                angle: inputAngle,
                distance: Math.sqrt((input.x - centerX) ** 2 + (input.y - centerY) ** 2),
                hue: input.hue,
                input: input
              });
              
              // Check for color resonance (similar wavelength)
              const hueDiff = Math.abs(input.hue - this.hue);
              const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);
              
              // If packet color is similar (within 60 degrees on color wheel)
              if (normalizedHueDiff < 60) {
                matchingPackets.push({
                  angle: inputAngle,
                  hue: input.hue,
                  resonance: 1 - (normalizedHueDiff / 60) // Closer = stronger resonance
                });
              }
            }
          });
          
          // Orient toward incoming packet stream
          if (nearbyPackets.length > 0) {
            let avgAngle = 0;
            nearbyPackets.forEach(p => {
              avgAngle += p.angle;
            });
            avgAngle /= nearbyPackets.length;
            
            const angleDiff = avgAngle - this.angle;
            this.angle += angleDiff * 0.03;
          }
          
          // SRL RAINBOW LOCK: Tune to matching wavelengths
          if (matchingPackets.length > 0) {
            // Find strongest resonance
            let strongestResonance = matchingPackets.reduce((max, p) => 
              p.resonance > max.resonance ? p : max
            );
            
            // Lock onto this wavelength
            this.lockStrength = Math.min(1, this.lockStrength + 0.05);
            this.attractedToHue = strongestResonance.hue;
            
            // Shift hue toward target wavelength
            const targetHueDiff = this.attractedToHue - this.hue;
            const normalizedDiff = targetHueDiff > 180 ? targetHueDiff - 360 : 
                                   targetHueDiff < -180 ? targetHueDiff + 360 : targetHueDiff;
            this.hue += normalizedDiff * 0.05 * this.lockStrength;
            
            // Drift angle slightly toward matching packets for better capture
            if (matchingPackets.length > 0) {
              let avgMatchAngle = matchingPackets.reduce((sum, p) => sum + p.angle, 0) / matchingPackets.length;
              const matchAngleDiff = avgMatchAngle - this.angle;
              this.angle += matchAngleDiff * 0.02 * this.lockStrength; // Extra drift when locked
            }
          } else {
            // No matching wavelengths - slowly return to base hue and reduce lock
            this.lockStrength = Math.max(0, this.lockStrength - 0.02);
            const returnDiff = this.baseHue - this.hue;
            const normalizedReturn = returnDiff > 180 ? returnDiff - 360 : 
                                     returnDiff < -180 ? returnDiff + 360 : returnDiff;
            this.hue += normalizedReturn * 0.01;
          }
        }
        
        this.connectedPatterns = allPatterns.filter(p => {
          if (!p || p.x === undefined || p.y === undefined) return false;
          const angleDiff = Math.abs(this.angle - p.angle);
          const normalizedDiff = Math.min(angleDiff, Math.PI * 2 - angleDiff);
          return normalizedDiff < 0.9;
        });
        
        this.energyLevel = this.connectedPatterns.length * 0.1;
        
        const cloudX = centerX + Math.cos(this.angle) * this.distance;
        const cloudY = centerY + Math.sin(this.angle) * this.distance;
        
        this.activeFiltering = false;
        if (convergingInputs && convergingInputs.length > 0) {
          convergingInputs.forEach(input => {
            if (!input || input.x === undefined || input.y === undefined) return;
            const dist = Math.sqrt((input.x - cloudX) ** 2 + (input.y - cloudY) ** 2);
            if (dist < 40) {
              this.activeFiltering = true;
              this.energyLevel += 0.5;
            }
          });
        }
        
        this.connectedPatterns.forEach(pattern => {
          pattern.cloudInfluence = this.hue;
          pattern.connectedToCloud = true;
          pattern.fieldEnergyBoost = this.energyLevel;
        });
      }

      // NEW: Spawn output cell when input is successfully processed
      spawnOutputCell(time, expandingCells) {
        if (this.alpha > 0.5) {
          // Only spawn output if cloud is active and ready
          // Occasionally spawn 2 cells for high-energy processing
          const numCells = Math.random() < 0.9 ? 1 : 2;
          for (let i = 0; i < numCells; i++) {
            expandingCells.push(new ExpandingCell(this, time));
          }
        }
      }

      calculateCurvedPath(x1, y1, x2, y2, allPatterns) {
        const pathPoints = [];
        const numSegments = 5;
        
        for (let i = 1; i < numSegments; i++) {
          const t = i / numSegments;
          const directX = x1 + (x2 - x1) * t;
          const directY = y1 + (y2 - y1) * t;
          
          let totalForceX = 0;
          let totalForceY = 0;
          
          allPatterns.forEach(p => {
            const dx = p.x - directX;
            const dy = p.y - directY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 80 && dist > 5) {
              const influence = p.scale * (50 / dist);
              const angle = Math.atan2(dy, dx);
              
              totalForceX += Math.cos(angle) * influence;
              totalForceY += Math.sin(angle) * influence;
              
              if (influence > 0.5) {
                p.gravitationalMass = (p.gravitationalMass || 0) + 0.02;
              }
            }
          });
          
          const bendStrength = 0.3;
          const bentX = directX + totalForceX * bendStrength;
          const bentY = directY + totalForceY * bendStrength;
          
          pathPoints.push({ x: bentX, y: bentY });
        }
        
        return pathPoints;
      }

      draw(ctx, centerX, centerY, time, brainPatterns, fieldCoherence, resonances, allPatterns, systemCapacity) {
        // SRL RAINBOW LOCK visual feedback - glow when locked onto wavelength
        if (this.lockStrength > 0.3) {
          const cloudX = centerX + Math.cos(this.angle) * this.distance;
          const cloudY = centerY + Math.sin(this.angle) * this.distance;
          
          const lockGlowRadius = 30 + this.lockStrength * 20;
          const lockGlowIntensity = this.lockStrength * 0.3;
          
          const lockGradient = ctx.createRadialGradient(cloudX, cloudY, 0, cloudX, cloudY, lockGlowRadius);
          lockGradient.addColorStop(0, `hsla(${this.hue}, 90%, 70%, ${lockGlowIntensity})`);
          lockGradient.addColorStop(0.5, `hsla(${this.hue}, 80%, 60%, ${lockGlowIntensity * 0.5})`);
          lockGradient.addColorStop(1, `hsla(${this.hue}, 70%, 50%, 0)`);
          
          ctx.fillStyle = lockGradient;
          ctx.beginPath();
          ctx.arc(cloudX, cloudY, lockGlowRadius, 0, Math.PI * 2);
          ctx.fill();
          
          // Pulsing ring when fully locked
          if (this.lockStrength > 0.7) {
            const ringPulse = Math.sin(time * 0.1) * 0.5 + 0.5;
            const ringRadius = lockGlowRadius * (0.8 + ringPulse * 0.2);
            ctx.strokeStyle = `hsla(${this.hue}, 90%, 70%, ${this.lockStrength * 0.4 * ringPulse})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cloudX, cloudY, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        
        const brainCore = brainPatterns[Math.floor(Math.random() * brainPatterns.length)];
        if (brainCore) {
          const coherenceBoost = 1 + fieldCoherence * 0.3;
          ctx.strokeStyle = `hsla(${this.hue}, 65%, 60%, ${this.alpha * 0.15 * coherenceBoost})`;
          ctx.lineWidth = 0.5 * coherenceBoost;
          ctx.beginPath();
          ctx.moveTo(brainCore.x, brainCore.y);
          
          const cloudX = centerX + Math.cos(this.angle) * this.distance;
          const cloudY = centerY + Math.sin(this.angle) * this.distance;
          const midX = (brainCore.x + cloudX) / 2 + Math.sin(time * 0.02 + this.phaseOffset) * 20;
          const midY = (brainCore.y + cloudY) / 2 + Math.cos(time * 0.02 + this.phaseOffset) * 20;
          ctx.quadraticCurveTo(midX, midY, cloudX, cloudY);
          ctx.stroke();
        }
        
        const cloudX = centerX + Math.cos(this.angle) * this.distance;
        const cloudY = centerY + Math.sin(this.angle) * this.distance;
        
        this.connectedPatterns.forEach(pattern => {
          const connectionStrength = 1 - (Math.abs(this.angle - pattern.angle) / 0.9);
          
          let resonanceModulation = 1;
          resonances.forEach(res => {
            const angleDist = Math.abs(res.angle - this.angle);
            if (angleDist < 0.5) {
              resonanceModulation += Math.abs(res.amplitude) * 0.01;
            }
          });
          
          const alpha = this.alpha * connectionStrength * 0.15 * resonanceModulation;
          
          ctx.strokeStyle = `hsla(${this.hue}, 70%, 65%, ${alpha})`;
          ctx.lineWidth = 0.5 + (fieldCoherence * 0.5);
          
          const pathPoints = this.calculateCurvedPath(cloudX, cloudY, pattern.x, pattern.y, allPatterns);
          
          ctx.beginPath();
          ctx.moveTo(cloudX, cloudY);
          
          if (pathPoints.length > 2) {
            ctx.quadraticCurveTo(
              pathPoints[0].x, 
              pathPoints[0].y,
              pathPoints[Math.floor(pathPoints.length / 2)].x,
              pathPoints[Math.floor(pathPoints.length / 2)].y
            );
            ctx.quadraticCurveTo(
              pathPoints[pathPoints.length - 1].x,
              pathPoints[pathPoints.length - 1].y,
              pattern.x,
              pattern.y
            );
          } else if (pathPoints.length > 0) {
            ctx.quadraticCurveTo(
              pathPoints[0].x,
              pathPoints[0].y,
              pattern.x,
              pattern.y
            );
          } else {
            ctx.lineTo(pattern.x, pattern.y);
          }
          
          ctx.stroke();
          
          if (Math.random() < 0.005 + fieldCoherence * 0.02) {
            const pathPointsForBurst = this.calculateCurvedPath(cloudX, cloudY, pattern.x, pattern.y, allPatterns);
            
            let burstX, burstY;
            if (pathPointsForBurst.length > 0) {
              const randomIndex = Math.floor(Math.random() * pathPointsForBurst.length);
              const burstPoint = pathPointsForBurst[randomIndex];
              burstX = burstPoint.x;
              burstY = burstPoint.y;
            } else {
              const t = Math.random();
              burstX = cloudX + (pattern.x - cloudX) * t;
              burstY = cloudY + (pattern.y - cloudY) * t;
            }
            
            this.particles.forEach(p => {
              const baseParticleAngle = p.angle + Math.sin(time * p.speed + p.phaseOffset) * 0.15;
              const baseParticleDist = this.distance + p.distOffset;
              const particleX = centerX + Math.cos(baseParticleAngle) * baseParticleDist;
              const particleY = centerY + Math.sin(baseParticleAngle) * baseParticleDist;
              
              const distToBurst = Math.sqrt((particleX - burstX) ** 2 + (particleY - burstY) ** 2);
              if (distToBurst < 40) {
                p.excitement = Math.min(2, p.excitement + 0.5);
              }
            });
            
            ctx.shadowBlur = 10 + fieldCoherence * 10;
            ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 0.8)`;
            ctx.fillStyle = `hsla(${this.hue}, 100%, 80%, 0.6)`;
            ctx.beginPath();
            ctx.arc(burstX, burstY, 2 + fieldCoherence, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
        
        this.particles.forEach(p => {
          const baseParticleAngle = p.angle + Math.sin(time * p.speed + p.phaseOffset) * 0.15;
          const baseParticleDist = this.distance + p.distOffset + Math.cos(time * p.speed * 0.7) * 10;
          let px = centerX + Math.cos(baseParticleAngle) * baseParticleDist;
          let py = centerY + Math.sin(baseParticleAngle) * baseParticleDist;
          
          if (p.targetPattern && p.excitement > 0.1) {
            const pullStrength = p.excitement * 0.2;
            px += (p.targetPattern.x - px) * pullStrength;
            py += (p.targetPattern.y - py) * pullStrength;
          }
          
          p.energy = 0.3 + Math.sin(time * p.speed * 2 + p.phaseOffset) * 0.2;
          p.energy *= (1 + fieldCoherence * 0.3);
          p.energy += p.excitement * 0.3;
          
          const particleAlpha = this.alpha * p.energy * 0.6;
          const particleSize = p.size * (1 + fieldCoherence * 0.2 + p.excitement * 0.25);
          
          let particleHue = this.hue;
          if (p.targetPattern && p.excitement > 0.2) {
            particleHue = this.hue + (p.targetPattern.hue - this.hue) * p.excitement * 0.3;
          }
          
          ctx.shadowBlur = 6 + fieldCoherence * 3 + p.excitement * 5;
          ctx.shadowColor = `hsla(${particleHue}, 70%, 65%, ${particleAlpha * 0.5})`;
          ctx.fillStyle = `hsla(${particleHue}, 75%, 68%, ${particleAlpha})`;
          ctx.beginPath();
          ctx.arc(px, py, particleSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }
    }

    const drawFieldResonance = (ctx) => {
      if (fieldResonance.length === 0) return;
      
      fieldResonance.forEach(res => {
        const radius = 150 + Math.abs(res.amplitude);
        const alpha = fieldCoherence * 0.08;
        
        ctx.strokeStyle = `hsla(220, 70%, 70%, ${alpha})`;
        ctx.lineWidth = 0.5 + fieldCoherence * 0.5;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    };

    const drawEmergentFieldGlow = (ctx) => {
      if (!brainFormed || fieldCoherence < 0.3) return;
      
      const glowRadius = 100 + collectiveBreath * 40;
      const glowIntensity = (fieldCoherence - 0.3) * 0.2;
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius);
      gradient.addColorStop(0, `rgba(180, 200, 255, ${glowIntensity})`);
      gradient.addColorStop(0.5, `rgba(150, 170, 255, ${glowIntensity * 0.4})`);
      gradient.addColorStop(1, 'rgba(150, 170, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    class Circuit {
      constructor(pattern1, pattern2, birthTime) {
        this.pattern1 = pattern1;
        this.pattern2 = pattern2;
        this.birthTime = birthTime;
        this.strength = 0;
        this.age = 0;
        this.lastPulseTime = birthTime;
      }

      update(currentTime, stillConnected, fieldCoherence) {
        this.age = currentTime - this.birthTime;
        
        if (stillConnected) {
          const coherenceBoost = 1 + fieldCoherence * 0.5;
          this.strength = Math.min(1, this.strength + 0.02 * coherenceBoost);
        } else {
          this.strength = Math.max(0, this.strength - 0.01);
        }
      }

      shouldRemove() {
        return this.strength <= 0;
      }

      draw(ctx, fieldCoherence) {
        if (this.strength < 0.1) return;
        
        const x1 = this.pattern1.x || centerX;
        const y1 = this.pattern1.y || centerY;
        const x2 = this.pattern2.x || centerX;
        const y2 = this.pattern2.y || centerY;
        
        const alpha = this.strength * 0.5 * (1 + fieldCoherence * 0.3);
        const avgHue = (this.pattern1.hue + this.pattern2.hue) / 2;
        
        ctx.strokeStyle = `hsla(${avgHue}, 80%, 60%, ${alpha})`;
        ctx.lineWidth = 1 + this.strength + fieldCoherence;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }

    class EnergyPulse {
      constructor(circuit, direction) {
        this.circuit = circuit;
        this.direction = direction;
        this.progress = direction > 0 ? 0 : 1;
        this.speed = 0.03;
        this.life = 1;
        this.hue = (circuit.pattern1.hue + circuit.pattern2.hue) / 2;
      }

      update(fieldCoherence) {
        const coherenceBoost = 1 + fieldCoherence * 0.5;
        this.progress += this.speed * this.direction * coherenceBoost;
        this.life -= 0.01;
        return this.life > 0 && this.progress >= 0 && this.progress <= 1;
      }

      draw(ctx, fieldCoherence) {
        const x1 = this.circuit.pattern1.x || centerX;
        const y1 = this.circuit.pattern1.y || centerY;
        const x2 = this.circuit.pattern2.x || centerX;
        const y2 = this.circuit.pattern2.y || centerY;
        
        const x = x1 + (x2 - x1) * this.progress;
        const y = y1 + (y2 - y1) * this.progress;
        
        const pulseAlpha = this.life * 0.3 * (1 + fieldCoherence * 0.2);
        const pulseSize = 2 + fieldCoherence * 0.3;
        
        ctx.shadowBlur = 8 + fieldCoherence * 4;
        ctx.shadowColor = `hsla(${this.hue}, 80%, 65%, ${pulseAlpha})`;
        ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${pulseAlpha})`;
        ctx.beginPath();
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    class ConvergingInput {
      constructor(angle, hue) {
        this.angle = angle;
        const dist = 200 + Math.random() * 150;
        this.x = centerX + Math.cos(angle) * dist;
        this.y = centerY + Math.sin(angle) * dist;
        this.hue = hue;
        this.speed = 1.5;
        this.filtered = false;
        this.filterProgress = 0;
        this.filteringCloud = null;
        this.targetX = undefined;
        this.targetY = undefined;
        
        // NEW: Random visual properties for variety
        this.shape = Math.floor(Math.random() * 6); // 0-5 different shapes
        this.size = 3 + Math.random() * 3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
      }

      update(brainClouds) {
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const gravity = 0.5;
        this.x += (dx / dist) * gravity;
        this.y += (dy / dist) * gravity;
        
        this.rotation += this.rotationSpeed;
        
        if (!this.filtered && brainClouds && brainClouds.length > 0) {
          brainClouds.forEach(cloud => {
            if (!cloud || cloud.distance === undefined) return;
            
            const cloudX = centerX + Math.cos(cloud.angle) * cloud.distance;
            const cloudY = centerY + Math.sin(cloud.angle) * cloud.distance;
            const cloudDist = Math.sqrt((this.x - cloudX) ** 2 + (this.y - cloudY) ** 2);
            
            if (cloudDist < 45 && !this.filtered) {
              this.filtered = true;
              this.filteringCloud = cloud;
              this.filterProgress = 0;
              this.targetX = cloudX;
              this.targetY = cloudY;
              
              // SRL RAINBOW LOCK: Cloud learns from this packet's color
              cloud.attractedToHue = this.hue;
            }
          });
        }
        
        if (this.filtered && this.filterProgress < 1) {
          this.filterProgress += 0.04;
          
          if (this.targetX !== undefined && this.targetY !== undefined) {
            const tdx = this.targetX - this.x;
            const tdy = this.targetY - this.y;
            const tdist = Math.sqrt(tdx * tdx + tdy * tdy);
            
            if (tdist > 1) {
              this.x += (tdx / tdist) * 3;
              this.y += (tdy / tdist) * 3;
            }
            
            const swirl = this.filterProgress * Math.PI * 6;
            this.x += Math.cos(swirl) * (1 - this.filterProgress) * 2;
            this.y += Math.sin(swirl) * (1 - this.filterProgress) * 2;
          }
          
          if (this.filterProgress >= 1) {
            return true;
          }
          
          return false;
        }
        
        if (!brainClouds || brainClouds.length === 0) {
          if (dist < 8) {
            return true;
          }
          this.x += (dx / dist) * this.speed;
          this.y += (dy / dist) * this.speed;
        }
        
        return false;
      }

      drawShape(ctx, x, y, size, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        const baseAlpha = 0.7;
        
        switch(this.shape) {
          case 0: // Triangle
            ctx.beginPath();
            for (let i = 0; i < 3; i++) {
              const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
              const px = Math.cos(angle) * size;
              const py = Math.sin(angle) * size;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            break;
            
          case 1: // Square
            ctx.beginPath();
            ctx.rect(-size, -size, size * 2, size * 2);
            ctx.closePath();
            break;
            
          case 2: // Pentagon
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
              const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
              const px = Math.cos(angle) * size;
              const py = Math.sin(angle) * size;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            break;
            
          case 3: // Hexagon
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
              const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
              const px = Math.cos(angle) * size;
              const py = Math.sin(angle) * size;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            break;
            
          case 4: // Star
            ctx.beginPath();
            for (let i = 0; i < 10; i++) {
              const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
              const r = i % 2 === 0 ? size : size * 0.5;
              const px = Math.cos(angle) * r;
              const py = Math.sin(angle) * r;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            break;
            
          case 5: // Circle
            ctx.beginPath();
            ctx.arc(0, 0, size, 0, Math.PI * 2);
            ctx.closePath();
            break;
        }
        
        ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${baseAlpha * 0.4})`;
        ctx.strokeStyle = `hsla(${this.hue}, 90%, 70%, ${baseAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
      }

      draw(ctx) {
        if (this.filtered && this.filterProgress < 1) {
          const dissolveAlpha = 0.8 * (1 - this.filterProgress);
          const dissolveSize = this.size * (1 - this.filterProgress * 0.7);
          
          const filterHue = this.filteringCloud ? 
            this.hue * (1 - this.filterProgress) + this.filteringCloud.hue * this.filterProgress :
            this.hue;
          
          ctx.shadowBlur = 8 + this.filterProgress * 8;
          ctx.shadowColor = `hsla(${filterHue}, 80%, 70%, ${dissolveAlpha * 0.5})`;
          
          this.drawShape(ctx, this.x, this.y, dissolveSize, this.rotation);
          
          ctx.shadowBlur = 0;
        } else {
          ctx.shadowBlur = 5;
          ctx.shadowColor = `hsla(${this.hue}, 80%, 70%, 0.4)`;
          
          this.drawShape(ctx, this.x, this.y, this.size, this.rotation);
          
          ctx.shadowBlur = 0;
        }
      }
    }

    class ValidatedPattern {
      constructor(angle, hue, birthTime) {
        this.angle = angle;
        this.baseHue = hue;
        this.hue = hue;
        this.birthTime = birthTime;
        this.age = 0;
        this.scale = 1;
        this.baseLength = 100;
        this.phaseOffset = Math.random() * Math.PI * 2;
        this.evolutionStage = 0;
        this.geometryType = 0;
        this.neighbors = [];
        this.circuitPartners = new Set();
        this.id = Math.random();
        this.connectedToCloud = false;
        this.cloudInfluence = 0;
        this.fieldEnergyBoost = 0;
        this.gravitationalMass = 0;
        
        this.x = centerX + Math.cos(angle) * this.baseLength * this.scale;
        this.y = centerY + Math.sin(angle) * this.baseLength * this.scale;
      }

      update(time, chaos, allPatterns) {
        this.age = time - this.birthTime;
        
        const atBoundary = this.baseLength > 150;
        const decayRate = atBoundary ? 0.0015 : 0.002;
        const ageScale = Math.max(0.15, 1 / (1 + this.age * decayRate));
        this.scale = ageScale;
        
        this.x = centerX + Math.cos(this.angle) * this.baseLength * this.scale;
        this.y = centerY + Math.sin(this.angle) * this.baseLength * this.scale;
        
        this.evolutionStage = this.age * 0.008 + chaos.x * 0.5;
        this.geometryType = (this.evolutionStage * 0.7 + chaos.y * 2) % 6;
        
        this.neighbors = allPatterns.filter(r => {
          if (r === this) return false;
          const angleDiff = Math.abs(this.angle - r.angle);
          return angleDiff < 0.8 && r.scale > 0.3;
        });
        
        let neighborHueInfluence = 0;
        if (this.neighbors.length > 0) {
          neighborHueInfluence = this.neighbors.reduce((sum, n) => sum + n.hue, 0) / this.neighbors.length;
        }
        
        let cloudHueInfluence = 0;
        if (this.connectedToCloud && this.cloudInfluence) {
          cloudHueInfluence = this.cloudInfluence * 0.15;
        }
        
        this.hue = (this.baseHue + this.age * 0.1 + chaos.z * 0.5 + neighborHueInfluence * 0.1 + cloudHueInfluence) % 360;
        
        this.gravitationalMass = Math.max(0, (this.gravitationalMass || 0) * 0.92);
        
        this.connectedToCloud = false;
      }

      draw(ctx, centerX, centerY, time, chaos) {
        const length = this.baseLength * this.scale;
        if (length < 3) return;
        
        const distFromCenter = length;
        const validationStrength = Math.max(0.2, 1 - distFromCenter / 400);
        
        const emergentBoost = 1 + this.fieldEnergyBoost;
        const massBoost = 1 + Math.min(this.gravitationalMass, 1.5);
        const alpha = Math.min(0.9, (0.3 + this.scale * 0.6) * validationStrength * emergentBoost * massBoost);
        
        if (this.gravitationalMass > 0.5) {
          ctx.shadowBlur = 8 * this.gravitationalMass;
          ctx.shadowColor = `hsla(${this.hue}, 80%, 65%, ${this.gravitationalMass * 0.15})`;
        }
        
        this.drawBranch(ctx, centerX, centerY, length, this.angle, 5, this.hue, alpha, time, 0, validationStrength);
        
        ctx.shadowBlur = 0;
        
        this.fieldEnergyBoost = 0;
      }

      drawBranch(ctx, x, y, length, angle, depth, hue, baseAlpha, time, gen, validationStrength) {
        if (depth === 0 || length < 1) {
          this.drawEvolvingBody(ctx, x, y, angle, hue, Math.max(baseAlpha, 0.3), time);
          return;
        }

        const endX = x + length * Math.cos(angle);
        const endY = y + length * Math.sin(angle);

        const dx = endX - centerX;
        const dy = endY - centerY;
        const distFromCenter = Math.sqrt(dx * dx + dy * dy);
        const branchValidation = Math.max(0.2, 1 - distFromCenter / 400);

        const alpha = baseAlpha * (depth / 6) * branchValidation;
        const localHue = (hue + gen * 8) % 360;
        
        ctx.strokeStyle = `hsla(${localHue}, 75%, 55%, ${alpha})`;
        ctx.lineWidth = Math.max(0.5, depth * 1.0 * this.scale);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        if (depth > 2 && depth < 6) {
          this.drawEvolvingBody(ctx, endX, endY, angle, localHue, Math.max(alpha, 0.25), time);
        }

        const branchAngle = Math.PI / 5.5;
        const lengthMult = 0.67;
        
        this.drawBranch(ctx, endX, endY, length * lengthMult, angle - branchAngle, depth - 1, localHue, baseAlpha, time, gen + 1, branchValidation);
        this.drawBranch(ctx, endX, endY, length * lengthMult, angle + branchAngle, depth - 1, localHue, baseAlpha, time, gen + 1, branchValidation);
        
        if (depth > 4 && Math.sin(time * 0.015 + gen + this.phaseOffset) > 0.6) {
          this.drawBranch(ctx, endX, endY, length * lengthMult * 0.75, angle, depth - 1, localHue, baseAlpha, time, gen + 1, branchValidation);
        }
      }

      drawEvolvingBody(ctx, x, y, angle, hue, alpha, time) {
        const size = Math.max(3, 5 * this.scale);
        const stage = Math.floor(this.geometryType);
        const rotation = time * 0.01 * this.evolutionStage + this.phaseOffset;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        const cycleStage = stage % 6;
        
        switch(cycleStage) {
          case 0:
            this.drawGeometry(ctx, size, 3, hue, alpha);
            break;
          case 1:
            this.drawGeometry(ctx, size, 4, hue, alpha);
            break;
          case 2:
            this.drawGeometry(ctx, size, 5, hue, alpha);
            break;
          case 3:
            this.drawGeometry(ctx, size, 6, hue, alpha);
            break;
          case 4:
            this.drawStar(ctx, size, 6, hue, alpha);
            break;
          case 5:
            this.drawCircle(ctx, size, hue, alpha);
            break;
        }
        
        ctx.restore();
      }

      drawGeometry(ctx, size, sides, hue, alpha) {
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
        ctx.strokeStyle = `hsla(${hue}, 90%, 70%, ${alpha * 0.8})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= sides; i++) {
          const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
          const px = Math.cos(angle) * size;
          const py = Math.sin(angle) * size;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      drawStar(ctx, size, points, hue, alpha) {
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
        ctx.strokeStyle = `hsla(${hue}, 90%, 70%, ${alpha * 0.8})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= points * 2; i++) {
          const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
          const r = i % 2 === 0 ? size : size * 0.5;
          const px = Math.cos(angle) * r;
          const py = Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      drawCircle(ctx, size, hue, alpha) {
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
        ctx.strokeStyle = `hsla(${hue}, 90%, 70%, ${alpha * 0.8})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    function animate() {
      time++;
      chaos = updateChaos(chaos);

      ctx.fillStyle = 'rgba(5, 5, 10, 0.12)';
      ctx.fillRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 500);
      gradient.addColorStop(0, 'rgba(40, 50, 80, 0.04)');
      gradient.addColorStop(0.5, 'rgba(20, 25, 40, 0.02)');
      gradient.addColorStop(1, 'rgba(5, 5, 10, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      if (!brainFormed && checkBrainFormation()) {
        brainFormed = true;
        
        const numClouds = 8;
        for (let i = 0; i < numClouds; i++) {
          const angle = (i / numClouds) * Math.PI * 2;
          const distance = 180 + Math.random() * 60;
          brainClouds.push(new BrainCloud(angle, distance, time));
        }
      }

      if (brainFormed) {
        brainFormationProgress = Math.min(1, brainFormationProgress + 0.01);
        
        fieldCoherence = calculateFieldCoherence();
        fieldResonance = generateFieldResonance();
        collectiveBreath = Math.sin(time * 0.008) * fieldCoherence;
        
        const maxPatterns = 80;
        const patternLoad = validatedPatterns.length / maxPatterns;
        const patternCapacity = 1 - patternLoad;
        
        const activeClouds = brainClouds.filter(c => c.activeFiltering).length;
        const cloudLoad = activeClouds / brainClouds.length;
        const cloudCapacity = 1 - cloudLoad * 0.2;
        
        const inputPressure = Math.min(1, convergingInputs.length / 20);
        const queueCapacity = 1 - inputPressure;
        
        const coherenceBoost = fieldCoherence * 0.5;
        
        systemCapacity = Math.max(0.1, Math.min(1, 
          (patternCapacity * 0.25 + cloudCapacity * 0.25 + queueCapacity * 0.5) + coherenceBoost
        ));
      } else {
        systemCapacity = 0.5;
      }
      
      const targetAperture = systemCapacity * 2.5;
      const adaptSpeed = 0.03;
      apertureSize += (targetAperture - apertureSize) * adaptSpeed;
      apertureSize = Math.max(0.2, Math.min(3, apertureSize));

      const zoom = 1 + Math.sin(time * 0.003) * 0.015;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(zoom, zoom);
      ctx.translate(-centerX, -centerY);

      if (time >= nextSpawn) {
        // Random rainbow color for each incoming packet
        const hue = Math.random() * 360; // Full rainbow spectrum
        convergingInputs.push(new ConvergingInput(nextAngle, hue));
        
        const angleIncrement = (chaos.y * 0.5 + 0.3) * Math.PI * 2;
        nextAngle = (nextAngle + angleIncrement) % (Math.PI * 2);
        nextSpawn = time + 40 + Math.abs(chaos.x) * 20;
      }

      convergingInputs = convergingInputs.filter(input => {
        const validated = input.update(brainClouds);
        if (validated) {
          // Successfully filtered through cloud - create validation burst
          if (input.filteringCloud) {
            const cloudX = centerX + Math.cos(input.filteringCloud.angle) * input.filteringCloud.distance;
            const cloudY = centerY + Math.sin(input.filteringCloud.angle) * input.filteringCloud.distance;
            
            // Small burst effect showing successful filtering
            for (let i = 0; i < 4; i++) {
              const burstAngle = Math.random() * Math.PI * 2;
              const burstDist = 5 + Math.random() * 10;
              ctx.strokeStyle = `hsla(${input.filteringCloud.hue}, 70%, 70%, 0.4)`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(cloudX, cloudY);
              ctx.lineTo(
                cloudX + Math.cos(burstAngle) * burstDist,
                cloudY + Math.sin(burstAngle) * burstDist
              );
              ctx.stroke();
            }
            
            // INPUT-OUTPUT BALANCE: Spawn output cell for each validated input
            input.filteringCloud.spawnOutputCell(time, expandingCells);
          }
          
          validatedPatterns.push(new ValidatedPattern(input.angle, input.hue, time));
          return false;
        }
        input.draw(ctx);
        return true;
      });

      validatedPatterns.forEach(pattern => {
        pattern.update(time, chaos, validatedPatterns);
      });

      const brainPatterns = validatedPatterns.filter(p => {
        const dist = p.baseLength * p.scale;
        return dist < 120;
      });

      if (brainFormed) {
        brainClouds.forEach(cloud => {
          cloud.update(time, validatedPatterns, collectiveBreath, convergingInputs, expandingCells);
        });
      }

      // NEW: Update and draw expanding cells
      expandingCells = expandingCells.filter(cell => {
        return cell.update();
      });

      drawEmergentFieldGlow(ctx);
      drawFieldResonance(ctx);

      validatedPatterns.forEach(pattern => {
        pattern.draw(ctx, centerX, centerY, time, chaos);
      });

      // NEW: Draw expanding cells
      expandingCells.forEach(cell => {
        cell.draw(ctx);
      });

      if (brainFormed) {
        brainClouds.forEach(cloud => {
          cloud.draw(ctx, centerX, centerY, time, brainPatterns, fieldCoherence, fieldResonance, validatedPatterns);
        });
      }

      validatedPatterns.forEach(p1 => {
        p1.neighbors.forEach(p2 => {
          let existingCircuit = circuits.find(c => 
            (c.pattern1 === p1 && c.pattern2 === p2) || 
            (c.pattern1 === p2 && c.pattern2 === p1)
          );
          
          if (existingCircuit) {
            existingCircuit.update(time, true, fieldCoherence);
            
            if (existingCircuit.strength > 0.7 && time - existingCircuit.lastPulseTime > 30) {
              energyPulses.push(new EnergyPulse(existingCircuit, 1));
              energyPulses.push(new EnergyPulse(existingCircuit, -1));
              existingCircuit.lastPulseTime = time;
            }
          } else {
            circuits.push(new Circuit(p1, p2, time));
            p1.circuitPartners.add(p2.id);
            p2.circuitPartners.add(p1.id);
          }
        });
      });

      circuits = circuits.filter(circuit => {
        const p1Exists = validatedPatterns.includes(circuit.pattern1);
        const p2Exists = validatedPatterns.includes(circuit.pattern2);
        const stillConnected = p1Exists && p2Exists && circuit.pattern1.neighbors.includes(circuit.pattern2);
        
        circuit.update(time, stillConnected, fieldCoherence);
        
        if (!circuit.shouldRemove()) {
          circuit.draw(ctx, fieldCoherence);
          return true;
        }
        return false;
      });

      energyPulses = energyPulses.filter(pulse => {
        const alive = pulse.update(fieldCoherence);
        if (alive) pulse.draw(ctx, fieldCoherence);
        return alive;
      });

      if (validatedPatterns.length > 60) {
        validatedPatterns = validatedPatterns.slice(-60);
      }

      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-screen bg-gray-900 overflow-hidden relative">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default ConsciousnessFractal;