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
    let expandingCells = [];
    let boundaryOrbs = [];
    let boundarySegments = [];
    let fluidParticles = [];
    let membraneClosed = false;
    let membraneClosedTime = 0;
    let fluidPressure = 0;
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

    class ExpandingCell {
      constructor(sourceCloud, birthTime) {
        this.sourceCloud = sourceCloud;
        this.birthTime = birthTime;
        this.age = 0;
        
        this.angle = sourceCloud.angle + (Math.random() - 0.5) * 0.3;
        this.distance = sourceCloud.distance;
        this.hue = sourceCloud.hue + (Math.random() - 0.5) * 20;
        
        this.expansionSpeed = 1.0 + Math.random() * 0.8;
        this.maxRadius = 16 + Math.random() * 22;
        this.currentRadius = 0;
        
        this.lifecycle = 0;
        this.lifecycleSpeed = 0.003 + Math.random() * 0.002;
        
        this.phaseOffset = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.015;
        this.rotation = 0;
        
        this.fractalSeed = Math.random() * 4 - 2;
        this.fractalComplexity = 3 + Math.floor(Math.random() * 3);
      }

      update() {
        this.age++;
        this.lifecycle += this.lifecycleSpeed;
        
        this.distance += this.expansionSpeed;
        
        if (this.lifecycle < 1) {
          this.currentRadius = this.maxRadius * this.lifecycle;
        } else if (this.lifecycle < 2) {
          this.currentRadius = this.maxRadius;
        } else if (this.lifecycle < 3) {
          this.currentRadius = this.maxRadius * (1 + Math.sin(this.age * 0.05) * 0.1);
        } else {
          const decayProgress = (this.lifecycle - 3);
          this.currentRadius = this.maxRadius * Math.max(0, 1 - decayProgress);
        }
        
        this.rotation += this.rotationSpeed;
        
        this.x = centerX + Math.cos(this.angle) * this.distance;
        this.y = centerY + Math.sin(this.angle) * this.distance;
        
        return this.lifecycle < 4 && this.distance < Math.max(width, height);
      }

      mandelbrotSample(cx, cy, maxIter) {
        const maxIterValue = maxIter || 25;
        let x = 0;
        let y = 0;
        let iteration = 0;
        
        while (x * x + y * y <= 4 && iteration < maxIterValue) {
          const xtemp = x * x - y * y + cx;
          y = 2 * x * y + cy;
          x = xtemp;
          iteration++;
        }
        
        return iteration;
      }

      draw(ctx) {
        if (this.currentRadius < 0.5) return;
        
        let alpha;
        if (this.lifecycle < 1) {
          alpha = this.lifecycle * 0.5;
        } else if (this.lifecycle < 2) {
          alpha = 0.5;
        } else {
          alpha = 0.5 * (1 + Math.sin(this.age * 0.05) * 0.2);
        }
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const zoom = 0.012 + this.lifecycle * 0.003;
        const centerOffsetX = Math.sin(this.age * 0.02) * 0.4;
        const centerOffsetY = Math.cos(this.age * 0.02) * 0.4;
        
        const rings = 5;
        const samplesPerRing = 24;
        
        for (let ring = 0; ring < rings; ring++) {
          const ringRadius = (this.currentRadius / rings) * (ring + 1);
          const ringAlpha = alpha * (1 - ring / rings * 0.5);
          
          for (let i = 0; i < samplesPerRing; i++) {
            const angle = (i / samplesPerRing) * Math.PI * 2;
            const px = Math.cos(angle) * ringRadius;
            const py = Math.sin(angle) * ringRadius;
            
            const cx = px * zoom + centerOffsetX;
            const cy = py * zoom + centerOffsetY;
            const iter = this.mandelbrotSample(cx, cy, 25);
            
            if (iter < 25) {
              const iterHue = (this.hue + iter * 12) % 360;
              const brightness = 45 + (iter / 25) * 35;
              const pointAlpha = ringAlpha * (iter / 25) * 0.8;
              const pointSize = (1 + iter / 25 * 2) * (1 - ring / rings * 0.3);
              
              ctx.fillStyle = `hsla(${iterHue}, 80%, ${brightness}%, ${pointAlpha})`;
              ctx.beginPath();
              ctx.arc(px, py, pointSize, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        
        const arms = 6;
        for (let arm = 0; arm < arms; arm++) {
          const armAngle = (arm / arms) * Math.PI * 2 + this.rotation * 2;
          const points = 15;
          
          for (let i = 0; i < points; i++) {
            const t = i / points;
            const spiralRadius = this.currentRadius * t;
            const spiralAngle = armAngle + t * Math.PI * 2 * this.fractalComplexity;
            
            const px = Math.cos(spiralAngle) * spiralRadius;
            const py = Math.sin(spiralAngle) * spiralRadius;
            
            const cx = px * zoom * 1.5 + centerOffsetX;
            const cy = py * zoom * 1.5 + centerOffsetY;
            const iter = this.mandelbrotSample(cx, cy, 20);
            
            if (iter < 20) {
              const iterHue = (this.hue + iter * 15) % 360;
              const pointAlpha = alpha * (iter / 20) * (1 - t) * 0.6;
              const pointSize = 1.2 + (iter / 20) * 1.5;
              
              ctx.shadowBlur = 4;
              ctx.shadowColor = `hsla(${iterHue}, 85%, 65%, ${pointAlpha * 0.5})`;
              ctx.fillStyle = `hsla(${iterHue}, 85%, 60%, ${pointAlpha})`;
              ctx.beginPath();
              ctx.arc(px, py, pointSize, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
        
        const glowSize = this.currentRadius * 0.2;
        const glowSamples = 20;
        
        for (let i = 0; i < glowSamples; i++) {
          const gAngle = (i / glowSamples) * Math.PI * 2;
          const gRadius = glowSize * (0.3 + Math.random() * 0.7);
          const gx = Math.cos(gAngle) * gRadius;
          const gy = Math.sin(gAngle) * gRadius;
          
          const cx = gx * zoom * 2 + centerOffsetX;
          const cy = gy * zoom * 2 + centerOffsetY;
          const iter = this.mandelbrotSample(cx, cy, 30);
          
          if (iter < 30) {
            const iterHue = (this.hue + iter * 8) % 360;
            const coreAlpha = alpha * 0.7;
            
            ctx.shadowBlur = 10;
            ctx.shadowColor = `hsla(${iterHue}, 95%, 75%, ${coreAlpha * 0.6})`;
            ctx.fillStyle = `hsla(${iterHue}, 90%, 70%, ${coreAlpha})`;
            ctx.beginPath();
            ctx.arc(gx, gy, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.shadowBlur = 0;
        
        ctx.restore();
      }
    }

    class BoundaryOrb {
      constructor(angle, hue, birthTime) {
        this.angle = angle;
        this.distance = 240 + Math.random() * 20;
        this.targetDistance = 260;
        this.hue = hue;
        this.birthTime = birthTime;
        this.age = 0;
        
        this.size = 18 + Math.random() * 14;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        
        this.crystallized = true;
        this.divisionTimer = 100 + Math.random() * 100;
        this.canDivide = true;
        
        this.phaseOffset = Math.random() * Math.PI * 2;
        
        this.x = centerX + Math.cos(angle) * this.distance;
        this.y = centerY + Math.sin(angle) * this.distance;
      }

      update(time) {
        this.age++;
        
        this.distance += (this.targetDistance - this.distance) * 0.02;
        
        if (this.canDivide && this.divisionTimer > 0) {
          this.divisionTimer--;
          if (this.divisionTimer <= 0) {
            this.canDivide = false;
            console.log('💎 BOUNDARY ORB DIVIDING at angle:', (this.angle * 180 / Math.PI).toFixed(1), 'degrees');
            return 'divide';
          }
        }
        
        this.rotation += this.rotationSpeed;
        
        this.x = centerX + Math.cos(this.angle) * this.distance;
        this.y = centerY + Math.sin(this.angle) * this.distance;
        
        return true;
      }

      mandelbrotSample(cx, cy, maxIter) {
        const maxIterValue = maxIter || 25;
        let x = 0;
        let y = 0;
        let iteration = 0;
        
        while (x * x + y * y <= 4 && iteration < maxIterValue) {
          const xtemp = x * x - y * y + cx;
          y = 2 * x * y + cy;
          x = xtemp;
          iteration++;
        }
        
        return iteration;
      }

      draw(ctx, time) {
        const alpha = 0.9 + Math.sin(this.age * 0.03) * 0.1;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (this.canDivide && this.divisionTimer < 40) {
          const flashIntensity = (40 - this.divisionTimer) / 40;
          ctx.shadowBlur = 35 * flashIntensity;
          ctx.shadowColor = `hsla(${this.hue}, 100%, 90%, ${flashIntensity})`;
          
          for (let r = 0; r < 3; r++) {
            ctx.strokeStyle = `hsla(${this.hue}, 100%, 95%, ${flashIntensity * (1 - r * 0.3) * 0.8})`;
            ctx.lineWidth = 5 - r;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * (1.4 + r * 0.25), 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        
        const zoom = 0.012;
        const centerOffsetX = Math.sin(this.age * 0.02) * 0.4;
        const centerOffsetY = Math.cos(this.age * 0.02) * 0.4;
        
        const rings = 8;
        const samplesPerRing = 44;
        
        for (let ring = 0; ring < rings; ring++) {
          const ringRadius = (this.size / rings) * (ring + 1);
          const ringAlpha = alpha * (1 - ring / rings * 0.35);
          
          for (let i = 0; i < samplesPerRing; i++) {
            const angle = (i / samplesPerRing) * Math.PI * 2;
            const px = Math.cos(angle) * ringRadius;
            const py = Math.sin(angle) * ringRadius;
            
            const cx = px * zoom + centerOffsetX;
            const cy = py * zoom + centerOffsetY;
            const iter = this.mandelbrotSample(cx, cy, 28);
            
            if (iter < 28) {
              const iterHue = (this.hue + iter * 10) % 360;
              const brightness = 68 + (iter / 28) * 22;
              const pointAlpha = ringAlpha * (iter / 28) * 1.3;
              const pointSize = (1.5 + iter / 28 * 2.8) * (1 - ring / rings * 0.2);
              
              ctx.fillStyle = `hsla(${iterHue}, 98%, ${brightness}%, ${pointAlpha})`;
              ctx.beginPath();
              ctx.arc(px, py, pointSize, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        
        const crystallineArms = 16;
        for (let arm = 0; arm < crystallineArms; arm++) {
          const armAngle = (arm / crystallineArms) * Math.PI * 2;
          const points = 14;
          
          for (let i = 0; i < points; i++) {
            const t = i / points;
            const radius = this.size * t;
            
            const px = Math.cos(armAngle) * radius;
            const py = Math.sin(armAngle) * radius;
            
            const cx = px * zoom * 1.3 + centerOffsetX;
            const cy = py * zoom * 1.3 + centerOffsetY;
            const iter = this.mandelbrotSample(cx, cy, 24);
            
            if (iter < 24) {
              const iterHue = (this.hue + iter * 11) % 360;
              const pointAlpha = alpha * (iter / 24) * 1.2;
              const pointSize = 2.2 + (iter / 24) * 2.2;
              
              ctx.shadowBlur = 7;
              ctx.shadowColor = `hsla(${iterHue}, 96%, 78%, ${pointAlpha * 0.7})`;
              ctx.fillStyle = `hsla(${iterHue}, 96%, 73%, ${pointAlpha})`;
              ctx.beginPath();
              ctx.arc(px, py, pointSize, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
        
        const glowSize = this.size * 0.25;
        const glowSamples = 32;
        
        for (let i = 0; i < glowSamples; i++) {
          const gAngle = (i / glowSamples) * Math.PI * 2;
          const gRadius = glowSize * (0.3 + Math.random() * 0.7);
          const gx = Math.cos(gAngle) * gRadius;
          const gy = Math.sin(gAngle) * gRadius;
          
          const cx = gx * zoom * 2 + centerOffsetX;
          const cy = gy * zoom * 2 + centerOffsetY;
          const iter = this.mandelbrotSample(cx, cy, 32);
          
          if (iter < 32) {
            const iterHue = (this.hue + iter * 7) % 360;
            const coreAlpha = alpha * 0.95;
            
            ctx.shadowBlur = 14;
            ctx.shadowColor = `hsla(${iterHue}, 98%, 80%, ${coreAlpha * 0.7})`;
            ctx.fillStyle = `hsla(${iterHue}, 95%, 78%, ${coreAlpha})`;
            ctx.beginPath();
            ctx.arc(gx, gy, 2.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.shadowBlur = 0;
        
        ctx.restore();
      }
    }

    class BoundarySegment {
      constructor(cell1, cell2, birthTime) {
        this.cell1 = cell1;
        this.cell2 = cell2;
        this.birthTime = birthTime;
        this.age = 0;
        this.strength = 0;
        this.hue = (cell1.hue + cell2.hue) / 2;
      }

      update(time) {
        this.age = time - this.birthTime;
        
        if (this.cell1.crystallized && this.cell2.crystallized) {
          this.strength = Math.min(1, this.strength + 0.01);
        } else {
          this.strength = Math.max(0, this.strength - 0.02);
        }
        
        return this.strength > 0;
      }

      draw(ctx) {
        if (this.strength < 0.1) return;
        
        const alpha = this.strength * 0.5;
        
        const x1 = this.cell1.x;
        const y1 = this.cell1.y;
        const x2 = this.cell2.x;
        const y2 = this.cell2.y;
        
        const midX = (x1 + x2) / 2 + Math.sin(this.age * 0.01) * 5;
        const midY = (y1 + y2) / 2 + Math.cos(this.age * 0.01) * 5;
        
        const samples = 12;
        for (let i = 0; i < samples; i++) {
          const t = i / samples;
          
          const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
          const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;
          
          const zoom = 0.015;
          const cx = (px - centerX) * zoom;
          const cy = (py - centerY) * zoom;
          
          let x = 0;
          let y = 0;
          let iter = 0;
          while (x * x + y * y <= 4 && iter < 12) {
            const xtemp = x * x - y * y + cx;
            y = 2 * x * y + cy;
            x = xtemp;
            iter++;
          }
          
          if (iter < 12) {
            const iterHue = (this.hue + iter * 15) % 360;
            const pointAlpha = alpha * (iter / 12) * 0.9;
            const size = 1.8 + (iter / 12) * 1.5;
            
            ctx.shadowBlur = 6;
            ctx.shadowColor = `hsla(${iterHue}, 90%, 65%, ${pointAlpha * 0.6})`;
            ctx.fillStyle = `hsla(${iterHue}, 85%, 60%, ${pointAlpha})`;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
        
        ctx.shadowBlur = 8 * this.strength;
        ctx.shadowColor = `hsla(${this.hue}, 85%, 70%, ${alpha * 0.5})`;
        ctx.strokeStyle = `hsla(${this.hue}, 85%, 70%, ${alpha * 0.7})`;
        ctx.lineWidth = 1.5 + this.strength * 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(midX, midY, x2, y2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    class FluidParticle {
      constructor(x, y, time) {
        this.x = x;
        this.y = y;
        this.birthTime = time;
        this.age = 0;
        
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        
        this.hue = 200 + Math.random() * 40;
        this.size = 2 + Math.random() * 2;
        this.life = 1;
        
        this.phaseOffset = Math.random() * Math.PI * 2;
      }

      update(time, validatedPatterns, brainClouds) {
        this.age = time - this.birthTime;
        
        let flowX = 0;
        let flowY = 0;
        
        validatedPatterns.forEach(pattern => {
          if (!pattern.x || !pattern.y) return;
          const dx = pattern.x - this.x;
          const dy = pattern.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100 && dist > 5) {
            const influence = (100 - dist) / 100 * 0.02;
            flowX += (dx / dist) * influence;
            flowY += (dy / dist) * influence;
          }
        });
        
        brainClouds.forEach(cloud => {
          const cloudX = centerX + Math.cos(cloud.angle) * cloud.distance;
          const cloudY = centerY + Math.sin(cloud.angle) * cloud.distance;
          const dx = cloudX - this.x;
          const dy = cloudY - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120 && dist > 10) {
            const influence = (120 - dist) / 120 * 0.015;
            flowX += (-dy / dist) * influence;
            flowY += (dx / dist) * influence;
          }
        });
        
        const distFromCenter = Math.sqrt((this.x - centerX) * (this.x - centerX) + (this.y - centerY) * (this.y - centerY));
        const angleFromCenter = Math.atan2(this.y - centerY, this.x - centerX);
        const circulation = Math.sin(time * 0.005 + this.phaseOffset) * 0.01;
        flowX += Math.cos(angleFromCenter + Math.PI / 2) * circulation;
        flowY += Math.sin(angleFromCenter + Math.PI / 2) * circulation;
        
        const breathFlow = Math.sin(time * 0.008) * 0.008;
        flowX += (centerX - this.x) / distFromCenter * breathFlow;
        flowY += (centerY - this.y) / distFromCenter * breathFlow;
        
        this.vx += flowX;
        this.vy += flowY;
        this.vx *= 0.95;
        this.vy *= 0.95;
        
        this.x += this.vx;
        this.y += this.vy;
        
        const maxDist = 270;
        if (distFromCenter > maxDist) {
          const pushAngle = Math.atan2(this.y - centerY, this.x - centerX);
          this.x = centerX + Math.cos(pushAngle) * maxDist;
          this.y = centerY + Math.sin(pushAngle) * maxDist;
          this.vx *= -0.3;
          this.vy *= -0.3;
        }
        
        this.life -= 0.0003;
        
        return this.life > 0;
      }

      draw(ctx, time) {
        const pulsate = Math.sin(time * 0.02 + this.phaseOffset) * 0.3 + 0.7;
        const alpha = this.life * 0.45 * pulsate;
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${this.hue}, 85%, 70%, ${alpha * 0.6})`;
        ctx.fillStyle = `hsla(${this.hue}, 90%, 75%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * pulsate, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
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
        this.baseHue = this.hue;
        this.attractedToHue = null;
        this.lockStrength = 0;
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
            excitement: 0,
            migrationProgress: 0,
            canMigrate: Math.random() < 0.4
          });
        }
      }

      update(time, allPatterns, globalBreath, convergingInputs, boundaryOrbs) {
        const age = time - this.birthTime;
        
        if (age < 60) {
          this.alpha = age / 60;
        } else {
          this.alpha = Math.min(0.7, this.alpha);
        }
        
        const localWave = Math.sin(time * 0.01 + this.phaseOffset) * 10;
        const breathWave = globalBreath * 20;
        this.distance = this.baseDistance + localWave + breathWave;
        
        this.particles.forEach(p => {
          if (p.canMigrate && !p.migrating && Math.random() < 0.0015) {
            p.migrating = true;
            p.migrationProgress = 0;
            p.migrationStartTime = time;
            console.log('🌟 Particle starting migration to boundary!');
          }
          
          if (p.migrating) {
            p.migrationProgress += 0.005;
            
            if (p.migrationProgress >= 1) {
              const particleAngle = p.angle + Math.sin(time * p.speed + p.phaseOffset) * 0.15;
              boundaryOrbs.push(new BoundaryOrb(particleAngle, this.hue, time));
              p.migrating = false;
              p.canMigrate = false;
              console.log('🔷 Particle reached boundary! Spawning crystallized orb');
            }
          }
        });
        
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
                distance: Math.sqrt((input.x - centerX) * (input.x - centerX) + (input.y - centerY) * (input.y - centerY)),
                hue: input.hue,
                input: input
              });
              
              const hueDiff = Math.abs(input.hue - this.hue);
              const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);
              
              if (normalizedHueDiff < 60) {
                matchingPackets.push({
                  angle: inputAngle,
                  hue: input.hue,
                  resonance: 1 - (normalizedHueDiff / 60)
                });
              }
            }
          });
          
          if (nearbyPackets.length > 0) {
            let avgAngle = 0;
            nearbyPackets.forEach(p => {
              avgAngle += p.angle;
            });
            avgAngle /= nearbyPackets.length;
            
            const angleDiff = avgAngle - this.angle;
            this.angle += angleDiff * 0.03;
          }
          
          if (matchingPackets.length > 0) {
            const strongestResonance = matchingPackets.reduce((max, p) => 
              p.resonance > max.resonance ? p : max
            );
            
            this.lockStrength = Math.min(1, this.lockStrength + 0.05);
            this.attractedToHue = strongestResonance.hue;
            
            const targetHueDiff = this.attractedToHue - this.hue;
            const normalizedDiff = targetHueDiff > 180 ? targetHueDiff - 360 : 
                                   targetHueDiff < -180 ? targetHueDiff + 360 : targetHueDiff;
            this.hue += normalizedDiff * 0.05 * this.lockStrength;
            
            if (matchingPackets.length > 0) {
              let avgMatchAngle = matchingPackets.reduce((sum, p) => sum + p.angle, 0) / matchingPackets.length;
              const matchAngleDiff = avgMatchAngle - this.angle;
              this.angle += matchAngleDiff * 0.02 * this.lockStrength;
            }
          } else {
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
            const dist = Math.sqrt((input.x - cloudX) * (input.x - cloudX) + (input.y - cloudY) * (input.y - cloudY));
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

      spawnOutputCell(time, expandingCells) {
        if (this.alpha > 0.5) {
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

      draw(ctx, centerX, centerY, time, brainPatterns, fieldCoherence, resonances, allPatterns) {
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
            
            let burstX;
            let burstY;
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
              
              const distToBurst = Math.sqrt((particleX - burstX) * (particleX - burstX) + (particleY - burstY) * (particleY - burstY));
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
          
          if (p.migrating) {
            const targetDist = 250;
            const currentDist = Math.sqrt((px - centerX) * (px - centerX) + (py - centerY) * (py - centerY));
            const targetAngle = Math.atan2(py - centerY, px - centerX);
            
            px = centerX + Math.cos(targetAngle) * (currentDist + (targetDist - currentDist) * p.migrationProgress);
            py = centerY + Math.sin(targetAngle) * (currentDist + (targetDist - currentDist) * p.migrationProgress);
          }
          
          if (p.targetPattern && p.excitement > 0.1) {
            const pullStrength = p.excitement * 0.2;
            px += (p.targetPattern.x - px) * pullStrength;
            py += (p.targetPattern.y - py) * pullStrength;
          }
          
          p.energy = 0.3 + Math.sin(time * p.speed * 2 + p.phaseOffset) * 0.2;
          p.energy *= (1 + fieldCoherence * 0.3);
          p.energy += p.excitement * 0.3;
          
          const particleAlpha = this.alpha * p.energy * 0.6 * (p.migrating ? 1.5 : 1);
          const particleSize = p.size * (1 + fieldCoherence * 0.2 + p.excitement * 0.25) * (p.migrating ? 1.4 : 1);
          
          let particleHue = this.hue;
          if (p.migrating) {
            particleHue = this.hue + Math.sin(p.migrationProgress * Math.PI * 4) * 30;
          } else if (p.targetPattern && p.excitement > 0.2) {
            particleHue = this.hue + (p.targetPattern.hue - this.hue) * p.excitement * 0.3;
          }
          
          ctx.shadowBlur = 6 + fieldCoherence * 3 + p.excitement * 5 + (p.migrating ? 10 : 0);
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
        
        this.shape = Math.floor(Math.random() * 6);
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
            const cloudDist = Math.sqrt((this.x - cloudX) * (this.x - cloudX) + (this.y - cloudY) * (this.y - cloudY));
            
            if (cloudDist < 45 && !this.filtered) {
              this.filtered = true;
              this.filteringCloud = cloud;
              this.filterProgress = 0;
              this.targetX = cloudX;
              this.targetY = cloudY;
              
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

      mandelbrotIteration(cx, cy, maxIter) {
        const maxIterValue = maxIter || 20;
        let x = 0;
        let y = 0;
        let iteration = 0;
        
        while (x * x + y * y <= 4 && iteration < maxIterValue) {
          const xtemp = x * x - y * y + cx;
          y = 2 * x * y + cy;
          x = xtemp;
          iteration++;
        }
        
        return iteration;
      }

      drawShape(ctx, x, y, size, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        const baseAlpha = 0.7;
        const zoom = 0.02;
        const centerOffset = Math.sin(this.rotation * 2) * 0.5;
        
        const samples = 20 + this.shape * 4;
        
        for (let i = 0; i < samples; i++) {
          const angle = (i / samples) * Math.PI * 2;
          const radius = size * (0.8 + Math.sin(angle * (this.shape + 2)) * 0.3);
          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;
          
          const cx = px * zoom + centerOffset;
          const cy = py * zoom;
          const iter = this.mandelbrotIteration(cx, cy, 18);
          
          if (iter < 18) {
            const iterHue = (this.hue + iter * 12) % 360;
            const iterAlpha = baseAlpha * (iter / 18) * 0.7;
            const pointSize = 1.2 + (iter / 18) * 1.5;
            
            ctx.fillStyle = `hsla(${iterHue}, 85%, 65%, ${iterAlpha})`;
            ctx.beginPath();
            ctx.arc(px, py, pointSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        const innerSamples = 12;
        for (let i = 0; i < innerSamples; i++) {
          const angle = (i / innerSamples) * Math.PI * 2;
          const radius = size * 0.4;
          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;
          
          const cx = px * zoom * 1.5 + centerOffset;
          const cy = py * zoom * 1.5;
          const iter = this.mandelbrotIteration(cx, cy, 22);
          
          if (iter < 22) {
            const iterHue = (this.hue + iter * 10) % 360;
            
            ctx.shadowBlur = 6;
            ctx.shadowColor = `hsla(${iterHue}, 90%, 70%, ${baseAlpha * 0.5})`;
            ctx.fillStyle = `hsla(${iterHue}, 85%, 70%, ${baseAlpha * 0.6})`;
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.shadowBlur = 0;
        
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

      mandelbrotIteration(cx, cy, maxIter) {
        const maxIterValue = maxIter || 20;
        let x = 0;
        let y = 0;
        let iteration = 0;
        
        while (x * x + y * y <= 4 && iteration < maxIterValue) {
          const xtemp = x * x - y * y + cx;
          y = 2 * x * y + cy;
          x = xtemp;
          iteration++;
        }
        
        return iteration;
      }

      drawBranch(ctx, x, y, length, angle, depth, hue, baseAlpha, time, gen, validationStrength) {
        if (depth === 0 || length < 1) {
          this.drawMandelbrotBody(ctx, x, y, angle, hue, Math.max(baseAlpha, 0.3), time);
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
        
        const numSamples = Math.floor(length / 3);
        for (let i = 0; i < numSamples; i++) {
          const t = i / numSamples;
          const px = x + (endX - x) * t;
          const py = y + (endY - y) * t;
          
          const zoom = 0.002 + this.evolutionStage * 0.001;
          const cx = (px - width / 2) * zoom + Math.sin(time * 0.01) * 0.5;
          const cy = (py - height / 2) * zoom + Math.cos(time * 0.01) * 0.5;
          const iter = this.mandelbrotIteration(cx, cy, 15);
          
          const iterAlpha = (iter / 15) * alpha * 0.4;
          const size = (depth / 6) * 2 * this.scale;
          
          ctx.fillStyle = `hsla(${localHue + iter * 10}, 75%, ${45 + iter * 2}%, ${iterAlpha})`;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }

        if (depth > 2 && depth < 6) {
          this.drawMandelbrotBody(ctx, endX, endY, angle, localHue, Math.max(alpha, 0.25), time);
        }

        const branchAngle = Math.PI / 5.5;
        const lengthMult = 0.67;
        
        this.drawBranch(ctx, endX, endY, length * lengthMult, angle - branchAngle, depth - 1, localHue, baseAlpha, time, gen + 1, branchValidation);
        this.drawBranch(ctx, endX, endY, length * lengthMult, angle + branchAngle, depth - 1, localHue, baseAlpha, time, gen + 1, branchValidation);
        
        if (depth > 4 && Math.sin(time * 0.015 + gen + this.phaseOffset) > 0.6) {
          this.drawBranch(ctx, endX, endY, length * lengthMult * 0.75, angle, depth - 1, localHue, baseAlpha, time, gen + 1, branchValidation);
        }
      }

      drawMandelbrotBody(ctx, x, y, angle, hue, alpha, time) {
        const size = Math.max(8, 12 * this.scale);
        const rotation = time * 0.01 * this.evolutionStage + this.phaseOffset;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        const samples = 36;
        const zoom = 0.015 + Math.sin(this.evolutionStage * 0.3) * 0.005;
        const offsetX = Math.cos(time * 0.003 + this.phaseOffset) * 0.3;
        const offsetY = Math.sin(time * 0.003 + this.phaseOffset) * 0.3;
        
        for (let i = 0; i < samples; i++) {
          const sampleAngle = (i / samples) * Math.PI * 2;
          const radius = size * (0.5 + Math.sin(time * 0.02 + i) * 0.2);
          const px = Math.cos(sampleAngle) * radius;
          const py = Math.sin(sampleAngle) * radius;
          
          const cx = px * zoom + offsetX;
          const cy = py * zoom + offsetY;
          const iter = this.mandelbrotIteration(cx, cy, 20);
          
          if (iter < 20) {
            const iterHue = (hue + iter * 15) % 360;
            const iterAlpha = alpha * (iter / 20);
            const pointSize = 1.5 + (iter / 20) * 2;
            
            ctx.fillStyle = `hsla(${iterHue}, 85%, ${50 + iter * 2}%, ${iterAlpha})`;
            ctx.beginPath();
            ctx.arc(px, py, pointSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${hue}, 90%, 70%, ${alpha * 0.6})`;
        ctx.fillStyle = `hsla(${hue}, 85%, 65%, ${alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.restore();
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
        const hue = Math.random() * 360;
        convergingInputs.push(new ConvergingInput(nextAngle, hue));
        
        const angleIncrement = (chaos.y * 0.5 + 0.3) * Math.PI * 2;
        nextAngle = (nextAngle + angleIncrement) % (Math.PI * 2);
        nextSpawn = time + 40 + Math.abs(chaos.x) * 20;
      }

      convergingInputs = convergingInputs.filter(input => {
        const validated = input.update(brainClouds);
        if (validated) {
          if (input.filteringCloud) {
            const cloudX = centerX + Math.cos(input.filteringCloud.angle) * input.filteringCloud.distance;
            const cloudY = centerY + Math.sin(input.filteringCloud.angle) * input.filteringCloud.distance;
            
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
          cloud.update(time, validatedPatterns, collectiveBreath, convergingInputs, boundaryOrbs);
        });
      }

      const divisionEvents = [];
      boundaryOrbs = boundaryOrbs.filter(orb => {
        const result = orb.update(time);
        
        if (result === 'divide') {
          divisionEvents.push(orb);
          
          const divX = orb.x;
          const divY = orb.y;
          
          for (let r = 0; r < 5; r++) {
            ctx.shadowBlur = 30;
            ctx.shadowColor = `hsla(${orb.hue}, 100%, 88%, ${0.9 - r * 0.15})`;
            ctx.strokeStyle = `hsla(${orb.hue}, 100%, 94%, ${0.9 - r * 0.15})`;
            ctx.lineWidth = 6 - r;
            ctx.beginPath();
            ctx.arc(divX, divY, orb.size * (1.5 + r * 0.4), 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.shadowBlur = 0;
        }
        
        return result !== false;
      });

      divisionEvents.forEach(parentOrb => {
        console.log('💎💎 BOUNDARY ORB DIVIDING! Creating 2 daughters at boundary');
        
        for (let i = 0; i < 2; i++) {
          const angleSpacing = 0.10;
          const angleOffset = (i === 0 ? -angleSpacing : angleSpacing);
          const daughterOrb = new BoundaryOrb(
            parentOrb.angle + angleOffset,
            parentOrb.hue + (Math.random() - 0.5) * 20,
            time
          );
          daughterOrb.divisionTimer = 120 + Math.random() * 120;
          boundaryOrbs.push(daughterOrb);
        }
      });

      expandingCells = expandingCells.filter(cell => {
        return cell.update();
      });

      if (boundaryOrbs.length > 1) {
        boundaryOrbs.forEach((orb1, i) => {
          boundaryOrbs.forEach((orb2, j) => {
            if (i >= j) return;
            
            const dist = Math.sqrt((orb1.x - orb2.x) * (orb1.x - orb2.x) + (orb1.y - orb2.y) * (orb1.y - orb2.y));
            
            if (dist < 120 && dist > 5) {
              const existingSegment = boundarySegments.find(s => 
                (s.cell1 === orb1 && s.cell2 === orb2) || 
                (s.cell1 === orb2 && s.cell2 === orb1)
              );
              
              if (!existingSegment) {
                boundarySegments.push(new BoundarySegment(orb1, orb2, time));
              }
            }
          });
        });
      }

      boundarySegments = boundarySegments.filter(segment => segment.update(time));

      const boundaryOrbCount = boundaryOrbs.length;
      const strongSegments = boundarySegments.filter(s => s.strength > 0.7).length;
      
      if (!membraneClosed && boundaryOrbCount >= 6 && strongSegments >= 6) {
        membraneClosed = true;
        membraneClosedTime = time;
        fluidPressure = 0;
        console.log('🌊 MEMBRANE SEALED! Boundary orbs:', boundaryOrbCount, 'Fluid generation starting...');
      }

      if (membraneClosed && time - membraneClosedTime < 60) {
        const flashProgress = (time - membraneClosedTime) / 60;
        const flashAlpha = (1 - flashProgress) * 0.3;
        const flashRadius = 250 + flashProgress * 50;
        
        ctx.strokeStyle = `hsla(210, 90%, 70%, ${flashAlpha})`;
        ctx.lineWidth = 3 * (1 - flashProgress);
        ctx.beginPath();
        ctx.arc(centerX, centerY, flashRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, flashRadius);
        glowGradient.addColorStop(0, `rgba(180, 200, 255, ${flashAlpha * 0.2})`);
        glowGradient.addColorStop(1, 'rgba(180, 200, 255, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, flashRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (membraneClosed) {
        fluidPressure = Math.min(1, fluidPressure + 0.005);
        
        if (fluidParticles.length < 200 && Math.random() < 0.4 * fluidPressure) {
          const spawnAngle = Math.random() * Math.PI * 2;
          const spawnDist = 50 + Math.random() * 150;
          const fx = centerX + Math.cos(spawnAngle) * spawnDist;
          const fy = centerY + Math.sin(spawnAngle) * spawnDist;
          fluidParticles.push(new FluidParticle(fx, fy, time));
        }
      }

      if (time % 120 === 0) {
        console.log(`📊 Stats: ${boundaryOrbCount} boundary orbs, ${expandingCells.length} seed cells, ${strongSegments} membrane segments, ${fluidParticles.length} fluid particles`);
      }

      fluidParticles = fluidParticles.filter(particle => 
        particle.update(time, validatedPatterns, brainClouds)
      );

      drawEmergentFieldGlow(ctx);
      drawFieldResonance(ctx);

      boundarySegments.forEach(segment => {
        segment.draw(ctx);
      });

      boundaryOrbs.forEach(orb => {
        orb.draw(ctx, time);
      });

      fluidParticles.forEach(particle => {
        particle.draw(ctx, time);
      });

      validatedPatterns.forEach(pattern => {
        pattern.draw(ctx, centerX, centerY, time, chaos);
      });

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