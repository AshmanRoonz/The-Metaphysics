import React, { useEffect, useRef, useState } from 'react';

const TQLivingSystem = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [metrics, setMetrics] = useState({
    nodes: 0,
    generation: 1,
    energy: 100,
    score: 0,
    births: 0,
    deaths: 0
  });
  const [gameState, setGameState] = useState('playing'); // playing, won, lost
  const [aimAssist, setAimAssist] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    let time = 0;
    let nodes = [];
    let connections = [];
    let receipts = [];
    let targetModels = new Map();
    
    let targets = [];
    let projectiles = [];
    let score = 0;
    let energy = 100; // System energy - depletes over time, gained from hits
    let generation = 1;
    let birthCount = 0;
    let deathCount = 0;
    
    let Theta = {
      epsilon_I: 0.15,
      epsilon_C: 0.15,
      epsilon_E: 0.15,
      kappa: 0.2,
      beta: 2.0
    };

    class Target {
      constructor() {
        this.id = Math.random().toString(36);
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() - 0.5) * 3;
        this.radius = 15;
        this.alive = true;
        this.age = 0;
        
        targetModels.set(this.id, {
          observations: [],
          predictedVx: 0,
          predictedVy: 0,
          confidence: 0
        });
      }

      update() {
        this.age++;
        this.x += this.vx;
        this.y += this.vy;
        
        const model = targetModels.get(this.id);
        if (model) {
          model.observations.push({ vx: this.vx, vy: this.vy });
          if (model.observations.length > 10) model.observations.shift();
          
          const avgVx = model.observations.reduce((sum, o) => sum + o.vx, 0) / model.observations.length;
          const avgVy = model.observations.reduce((sum, o) => sum + o.vy, 0) / model.observations.length;
          
          model.predictedVx = avgVx;
          model.predictedVy = avgVy;
          model.confidence = Math.min(1.0, model.observations.length / 5);
        }
        
        if (this.x < this.radius || this.x > width - this.radius) this.vx *= -1;
        if (this.y < this.radius || this.y > height - this.radius) this.vy *= -1;
        
        if (this.age > 250) {
          targetModels.delete(this.id);
          return false;
        }
        
        return this.alive;
      }

      draw(ctx) {
        ctx.strokeStyle = `rgba(255, 100, 100, 0.6)`;
        ctx.fillStyle = `rgba(255, 100, 100, 0.2)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    class Projectile {
      constructor(x, y, targetX, targetY, energyCost) {
        this.x = x;
        this.y = y;
        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = 8;
        this.vx = (dx / dist) * speed;
        this.vy = (dy / dist) * speed;
        this.life = 60;
        this.radius = 4;
        this.energyCost = energyCost;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        
        targets.forEach(target => {
          if (target.alive) {
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < target.radius + this.radius) {
              target.alive = false;
              this.life = 0;
              
              // HIT! Gain energy and grow!
              score += 10;
              energy += 25; // Energy reward
              
              // Growth event - add new node!
              growNetwork();
              
              targetModels.delete(target.id);
            }
          }
        });
        
        return this.life > 0;
      }

      draw(ctx) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(100, 200, 255, 0.8)`;
        ctx.fillStyle = `rgba(100, 200, 255, 0.9)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // GROWTH: Add new node to network
    const growNetwork = () => {
      if (nodes.length >= 50) return; // Cap at 50 nodes
      
      // Find best spot for new node (near existing but not too close)
      let bestAngle = Math.random() * Math.PI * 2;
      let bestDist = 100 + Math.random() * 80;
      
      if (nodes.length > 0) {
        // Try to fill gaps
        const angles = nodes.map(n => Math.atan2(n.y - centerY, n.x - centerX));
        angles.sort((a, b) => a - b);
        
        let maxGap = 0;
        let gapAngle = 0;
        for (let i = 0; i < angles.length; i++) {
          const gap = (angles[(i + 1) % angles.length] - angles[i] + Math.PI * 2) % (Math.PI * 2);
          if (gap > maxGap) {
            maxGap = gap;
            gapAngle = angles[i] + gap / 2;
          }
        }
        
        if (maxGap > 0.5) {
          bestAngle = gapAngle;
        }
      }
      
      const newNode = new Node(bestAngle, Math.random(), 'birth');
      nodes.push(newNode);
      birthCount++;
      
      // Connect to nearby nodes
      nodes.forEach(other => {
        if (other !== newNode) {
          const dx = other.x - newNode.x;
          const dy = other.y - newNode.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150 && Math.abs(newNode.wavelength - other.wavelength) < 0.3) {
            const conn = new Connection(newNode, other);
            connections.push(conn);
            newNode.connections.push(conn);
            other.connections.push(conn);
          }
        }
      });
      
      // Increase generation counter
      if (birthCount % 5 === 0) {
        generation++;
      }
    };

    // DEATH: Remove weakest node when energy too low
    const cullNetwork = () => {
      if (nodes.length <= 3) return; // Keep minimum viable network
      
      // Find weakest node
      let weakest = nodes[0];
      nodes.forEach(node => {
        if (node.energy < weakest.energy || node.connections.length < weakest.connections.length) {
          weakest = node;
        }
      });
      
      // Remove node
      const index = nodes.indexOf(weakest);
      if (index > -1) {
        nodes.splice(index, 1);
        deathCount++;
        
        // Remove its connections
        connections = connections.filter(c => c.node1 !== weakest && c.node2 !== weakest);
        nodes.forEach(n => {
          n.connections = n.connections.filter(c => c.node1 !== weakest && c.node2 !== weakest);
        });
      }
    };

    const senseWorld = () => {
      if (targets.length === 0) return null;
      
      let closest = targets[0];
      let minDist = Infinity;
      
      targets.forEach(target => {
        if (target.alive) {
          const dist = Math.sqrt((target.x - centerX) ** 2 + (target.y - centerY) ** 2);
          if (dist < minDist) {
            minDist = dist;
            closest = target;
          }
        }
      });
      
      return closest.alive ? closest : null;
    };

    const validateShot = (target, networkState) => {
      if (!target) return { committed: false, reason: 'no_target' };
      
      const model = targetModels.get(target.id);
      const modelConfidence = model ? model.confidence : 0;
      
      const projectileSpeed = 8;
      const dist = Math.sqrt((target.x - centerX) ** 2 + (target.y - centerY) ** 2);
      const timeToImpact = dist / projectileSpeed;
      
      let predictedX = target.x;
      let predictedY = target.y;
      
      if (model && modelConfidence > 0.3) {
        predictedX = target.x + model.predictedVx * timeToImpact;
        predictedY = target.y + model.predictedVy * timeToImpact;
      }
      
      const coherence = networkState.coherence;
      const energyAvail = networkState.energy;
      const selfPassed = coherence > 0.4 && energyAvail > 10; // Need energy to act!
      
      const predictedDist = Math.sqrt((predictedX - centerX) ** 2 + (predictedY - centerY) ** 2);
      const inRange = predictedDist < 400;
      const notTooClose = predictedDist > 50;
      const sharedPassed = inRange && notTooClose;
      
      const evidenceScore = modelConfidence * 0.7 + (selfPassed ? 0.3 : 0);
      const evidencePassed = evidenceScore > 0.4;
      
      const allPassed = selfPassed && sharedPassed && evidencePassed;
      const clash = (selfPassed && !sharedPassed) ? 0.3 : 0;
      const tolerance = 0.45;
      const commitStrength = Theta.kappa > 0.7 ? 
        (allPassed ? 1.0 : 0.0) :
        Math.exp(Theta.beta * (1 - clash / tolerance));
      
      return {
        committed: commitStrength > 0.3 && evidencePassed && energyAvail > 10,
        commitStrength,
        selfPassed,
        sharedPassed,
        evidencePassed,
        modelConfidence,
        target,
        predictedX,
        predictedY,
        energyCost: 8
      };
    };

    const executeAction = (clickX, clickY) => {
      // Check cooldown
      if (time - lastShotTime < shotCooldown) return;
      
      // Check if we have energy
      if (energy < 10) return;
      
      const energyCost = 8;
      energy -= energyCost;
      lastShotTime = time;
      
      projectiles.push(new Projectile(
        centerX,
        centerY,
        clickX,
        clickY,
        energyCost
      ));
      
      receipts.push({
        timestamp: time,
        action: 'fire',
        energyCost: energyCost,
        nodes: nodes.length,
        generation: generation,
        target: { x: clickX, y: clickY }
      });
      
      if (receipts.length > 50) receipts.shift();
    };

    // Mouse/touch tracking
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      setMousePos({ x, y });
      
      // Calculate aim assist
      const target = senseWorld();
      if (target) {
        const model = targetModels.get(target.id);
        if (model && model.confidence > 0.4) {
          const dx = target.x - centerX;
          const dy = target.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const timeToImpact = dist / 8;
          
          setAimAssist({
            x: target.x + model.predictedVx * timeToImpact,
            y: target.y + model.predictedVy * timeToImpact,
            confidence: model.confidence
          });
        } else {
          setAimAssist(null);
        }
      } else {
        setAimAssist(null);
      }
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      executeAction(x, y);
    };

    const handleTouch = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;
      executeAction(x, y);
    };

    class Node {
      constructor(angle, wavelength, birthType = 'initial') {
        const r = 80 + Math.random() * 100;
        this.x = centerX + Math.cos(angle) * r;
        this.y = centerY + Math.sin(angle) * r;
        this.wavelength = wavelength;
        this.hue = wavelength * 360;
        this.coherence = 0.5 + Math.random() * 0.3;
        this.energy = 0.8;
        this.connections = [];
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.age = 0;
        this.birthType = birthType;
        this.birthAnimation = birthType === 'birth' ? 1.0 : 0;
      }

      update() {
        this.age++;
        this.pulsePhase += 0.05;
        this.birthAnimation = Math.max(0, this.birthAnimation - 0.02);
        
        const boost = this.connections.length * 0.02;
        this.coherence = Math.min(1.0, this.coherence + boost * 0.1);
        
        // Energy decays slowly
        this.energy = Math.max(0, this.energy * 0.9995 + this.connections.length * 0.001);
        
        return this.energy > 0.1;
      }

      draw(ctx) {
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        const size = 3 + this.coherence * 2 + pulse;
        
        // Birth animation
        if (this.birthAnimation > 0) {
          ctx.strokeStyle = `rgba(100, 255, 100, ${this.birthAnimation})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(this.x, this.y, size + 15 * (1 - this.birthAnimation), 0, Math.PI * 2);
          ctx.stroke();
        }
        
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${this.hue}, 85%, 65%, 0.5)`;
        ctx.fillStyle = `hsla(${this.hue}, 90%, 75%, 0.9)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    class Connection {
      constructor(node1, node2) {
        this.node1 = node1;
        this.node2 = node2;
        this.strength = 0.2;
      }

      update() {
        if (this.node1.energy > 0.4 && this.node2.energy > 0.4) {
          this.strength = Math.min(1.0, this.strength + 0.02);
        }
        return this.strength > 0.1;
      }

      draw(ctx) {
        ctx.strokeStyle = `hsla(200, 70%, 65%, ${this.strength * 0.3})`;
        ctx.lineWidth = 0.5 + this.strength;
        ctx.beginPath();
        ctx.moveTo(this.node1.x, this.node1.y);
        ctx.lineTo(this.node2.x, this.node2.y);
        ctx.stroke();
      }
    }

    // Initialize starting network
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const wavelength = i / 8;
      nodes.push(new Node(angle, wavelength, 'initial'));
    }

    nodes.forEach((n1, i) => {
      const n2 = nodes[(i + 1) % nodes.length];
      const conn = new Connection(n1, n2);
      connections.push(conn);
      n1.connections.push(conn);
      n2.connections.push(conn);
    });

    // Add event listeners AFTER handlers are defined
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouch);

    const calculateCoherence = () => {
      if (nodes.length === 0) return 0;
      const avgCoherence = nodes.reduce((sum, n) => sum + n.coherence, 0) / nodes.length;
      const avgEnergy = nodes.reduce((sum, n) => sum + n.energy, 0) / nodes.length;
      return (avgCoherence * 0.6 + avgEnergy * 0.4);
    };

    function animate() {
      time++;

      ctx.fillStyle = 'rgba(5, 5, 15, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // Energy depletion (metabolism)
      energy -= 0.1;
      
      // Death from starvation
      if (energy < 0) {
        energy = 0;
        if (nodes.length > 3 && time % 20 === 0) {
          cullNetwork();
        }
      }

      // Spawn targets
      if (time % 100 === 0 && targets.length < 4) {
        targets.push(new Target());
      }

    // Mouse/touch tracking
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      currentMousePos = { x, y };
      
      // Calculate aim assist
      const target = senseWorld();
      if (target) {
        const model = targetModels.get(target.id);
        if (model && model.confidence > 0.4) {
          const dx = target.x - centerX;
          const dy = target.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const timeToImpact = dist / 8;
          
          currentAimAssist = {
            x: target.x + model.predictedVx * timeToImpact,
            y: target.y + model.predictedVy * timeToImpact,
            confidence: model.confidence
          };
        } else {
          currentAimAssist = null;
        }
      } else {
        currentAimAssist = null;
      }
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      executeAction(x, y);
    };

    const handleTouch = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;
      executeAction(x, y);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouch);

      // Update world
      targets = targets.filter(t => t.update());
      projectiles = projectiles.filter(p => p.update());

      // Update network
      nodes = nodes.filter(n => n.update());
      connections = connections.filter(c => c.update());

      // Draw
      targets.forEach(t => t.draw(ctx));
      projectiles.forEach(p => p.draw(ctx));
      
      connections.forEach(c => c.draw(ctx));
      nodes.forEach(n => n.draw(ctx));

      // Draw center
      const centerSize = 6 + (energy / 10);
      ctx.strokeStyle = `rgba(100, 200, 255, ${Math.min(1, energy / 50)})`;
      ctx.fillStyle = `rgba(100, 200, 255, ${Math.min(0.3, energy / 200)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw crosshair at mouse position
      if (mousePos.x > 0 && mousePos.y > 0) {
        const canFire = time - lastShotTime >= shotCooldown && energy >= 10;
        ctx.strokeStyle = canFire ? 'rgba(100, 255, 200, 0.8)' : 'rgba(255, 100, 100, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mousePos.x - 15, mousePos.y);
        ctx.lineTo(mousePos.x + 15, mousePos.y);
        ctx.moveTo(mousePos.x, mousePos.y - 15);
        ctx.lineTo(mousePos.x, mousePos.y + 15);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 10, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw aim assist indicator
      if (aimAssist) {
        ctx.strokeStyle = `rgba(100, 255, 200, ${0.4 + aimAssist.confidence * 0.4})`;
        ctx.fillStyle = `rgba(100, 255, 200, ${0.15 + aimAssist.confidence * 0.2})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(aimAssist.x, aimAssist.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Confidence text
        ctx.fillStyle = `rgba(100, 255, 200, ${aimAssist.confidence})`;
        ctx.font = '12px monospace';
        ctx.fillText(`${(aimAssist.confidence * 100).toFixed(0)}%`, aimAssist.x + 20, aimAssist.y + 5);
        
        // Draw line from mouse to aim assist
        ctx.strokeStyle = `rgba(100, 255, 200, ${0.2 + aimAssist.confidence * 0.2})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(mousePos.x, mousePos.y);
        ctx.lineTo(aimAssist.x, aimAssist.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Check win/lose conditions
      if (energy <= 0 && nodes.length <= 2) {
        setGameState('lost');
      } else if (generation >= 10 && nodes.length >= 30) {
        setGameState('won');
      }

      setMetrics({
        nodes: nodes.length,
        generation: generation,
        energy: Math.max(0, energy),
        score: score,
        births: birthCount,
        deaths: deathCount
      });

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouch);
    };
  }, []);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      margin: 0, 
      padding: 0, 
      overflow: 'hidden',
      background: '#050510',
      position: 'relative'
    }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          display: 'block',
          width: '100%',
          height: '100%'
        }} 
      />
      
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'rgba(10, 10, 20, 0.92)',
        padding: '20px',
        borderRadius: '10px',
        border: '2px solid rgba(100, 200, 255, 0.5)',
        color: '#aaddff',
        fontFamily: 'monospace',
        fontSize: '14px',
        minWidth: '280px'
      }}>
        <div style={{ color: '#88ccff', fontWeight: 'bold', marginBottom: '14px', fontSize: '18px' }}>
          Living TQM System
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>
            Generation {metrics.generation}
          </div>
          <div style={{ fontSize: '24px', color: '#66ffcc', fontWeight: 'bold' }}>
            Score: {metrics.score}
          </div>
        </div>
        
        <div style={{ 
          marginBottom: '12px',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(100, 200, 255, 0.2)'
        }}>
          <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '6px' }}>
            Energy (Metabolism)
          </div>
          <div style={{ 
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '4px',
            height: '24px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(100, 200, 255, 0.3)'
          }}>
            <div style={{
              background: metrics.energy > 50 ? 
                'linear-gradient(90deg, #66ff99, #66ffcc)' :
                metrics.energy > 20 ?
                'linear-gradient(90deg, #ffcc66, #ff9966)' :
                'linear-gradient(90deg, #ff6666, #ff3333)',
              height: '100%',
              width: `${Math.min(100, metrics.energy)}%`,
              transition: 'width 0.3s, background 0.5s'
            }} />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#fff',
              textShadow: '0 0 3px rgba(0,0,0,0.8)'
            }}>
              {metrics.energy.toFixed(0)}
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: '8px' }}>
          <div>Nodes: <span style={{ color: '#66ffcc', fontWeight: 'bold' }}>{metrics.nodes}</span></div>
          <div style={{ fontSize: '11px', opacity: 0.7 }}>
            <span style={{ color: '#66ff99' }}>↑{metrics.births} births</span>
            {' • '}
            <span style={{ color: '#ff9999' }}>↓{metrics.deaths} deaths</span>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(100, 200, 255, 0.15)',
          fontSize: '11px',
          lineHeight: '1.6',
          opacity: 0.8
        }}>
          <strong>Living System:</strong><br/>
          • Hit targets → gain energy<br/>
          • Energy → grow new nodes<br/>
          • No energy → nodes die<br/>
          • Survive & evolve!
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        background: 'rgba(10, 10, 20, 0.9)',
        padding: '16px',
        borderRadius: '8px',
        border: metrics.energy < 20 ? '2px solid rgba(255, 100, 100, 0.6)' : '1px solid rgba(100, 200, 255, 0.3)',
        color: metrics.energy < 20 ? '#ffaaaa' : '#aaddff',
        fontFamily: 'monospace',
        fontSize: '12px',
        maxWidth: '260px',
        lineHeight: '1.6'
      }}>
        {gameState === 'lost' ? (
          <>
            <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#ff6666', fontSize: '16px' }}>
              💀 SYSTEM DIED
            </div>
            <div style={{ opacity: 0.9, marginBottom: '10px' }}>
              The living system starved and collapsed. Final generation: {metrics.generation}
            </div>
            <div style={{ fontSize: '11px', opacity: 0.7 }}>
              Refresh to try again!
            </div>
          </>
        ) : gameState === 'won' ? (
          <>
            <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#66ff99', fontSize: '16px' }}>
              🎉 THRIVING!
            </div>
            <div style={{ opacity: 0.9, marginBottom: '10px' }}>
              You've grown a sophisticated Gen {metrics.generation} network with {metrics.nodes} nodes! The system is self-sustaining.
            </div>
            <div style={{ fontSize: '11px', opacity: 0.7 }}>
              Keep going or refresh for new challenge!
            </div>
          </>
        ) : metrics.energy < 20 ? (
          <>
            <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#ff6666', fontSize: '14px' }}>
              ⚠️ CRITICAL!
            </div>
            <div style={{ opacity: 0.9 }}>
              Energy critically low! Click/tap targets quickly to keep the system alive!
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#88ccff', fontSize: '13px' }}>
              🎮 How to Play
            </div>
            <div style={{ opacity: 0.9 }}>
              <strong>Click/Tap</strong> to shoot projectiles at targets
              <br/><br/>
              <span style={{ color: '#66ff99' }}>Green dashed circle</span> = aim assist (lead prediction)
              <br/><br/>
              Hit targets → gain energy → system grows!
              <br/><br/>
              Miss or wait → lose energy → system dies!
              <br/><br/>
              <strong>Goal:</strong> Reach Gen 10 with 30+ nodes
            </div>
          </>
        )}
      </div>

      {aimAssist && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(10, 10, 20, 0.85)',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(100, 255, 200, 0.5)',
            color: '#66ffcc',
            fontFamily: 'monospace',
            fontSize: '11px',
            marginTop: '60px'
          }}>
            AIM ASSIST: {(aimAssist.confidence * 100).toFixed(0)}%
          </div>
        </div>
      )}
    </div>
  );
};

export default TQLivingSystem;