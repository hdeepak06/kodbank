import { useState, useRef, useEffect } from 'react';
import {
    Plus, Search, Image as ImageIcon, LayoutGrid, AppWindow,
    Zap, FolderOpen, User as UserIcon, Send, Mic, AudioLines,
    X, ChevronDown, MessageSquareShare, MessageCircle, Bot,
    PanelLeftClose, SquarePen, Share
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { postChat } from '../api';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // Modern Professional Color Palette
    const colors = {
        bg: '#050b18',
        sidebar: '#0a1428',
        inputBg: '#101e3a',
        accent: '#00d2ff', // Tech Cyan
        text: '#e0f2ff',
        textMuted: '#7dabcf',
        border: 'rgba(0, 210, 255, 0.15)'
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            const { data } = await postChat(currentInput);
            const botMessage = { id: Date.now() + 1, text: data.reply, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            const errorMessage = { id: Date.now() + 1, text: "The server is taking too long to respond. Please try again.", sender: 'bot', isError: true };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const SidebarItem = ({ icon: Icon, label, active = false }) => (
        <motion.div
            whileHover={{ backgroundColor: active ? '#2f2f2f' : 'rgba(255,255,255,0.04)' }}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                color: active ? '#fff' : colors.textMuted,
                background: active ? '#2f2f2f' : 'transparent',
                transition: 'all 0.2s ease',
                fontSize: '0.9rem',
                fontWeight: active ? '600' : '400',
            }}>
            <Icon size={18} strokeWidth={active ? 2.5 : 2} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
        </motion.div>
    );

    return (
        <>
            {/* BankKod Vertical Toggle Tab */}
            {!isOpen && (
                <div style={{ position: 'fixed', right: '0', top: '50%', transform: 'translateY(-50%)', zIndex: 1000 }}>
                    <motion.div
                        initial="initial"
                        whileHover="hover"
                        style={{ position: 'relative' }}
                    >
                        {/* Mascot Peek Animation */}
                        <motion.div
                            variants={{
                                initial: { x: 100, rotate: 20 },
                                hover: { x: -60, rotate: 0 }
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            style={{
                                position: 'absolute',
                                top: '-60px',
                                right: '10px',
                                width: '80px',
                                height: '80px',
                                background: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=00d2ff")',
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                zIndex: -1
                            }}
                        />

                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            onClick={() => setIsOpen(true)}
                            style={{
                                background: colors.accent,
                                color: '#050b18',
                                padding: '25px 12px',
                                borderRadius: '16px 0 0 16px',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '15px',
                                boxShadow: '-4px 0 30px rgba(0,0,0,0.4)',
                                border: '1px solid rgba(0,0,0,0.1)',
                                borderRight: 'none'
                            }}
                        >
                            <div style={{
                                writingMode: 'vertical-rl',
                                textOrientation: 'mixed',
                                fontWeight: '800',
                                fontSize: '1.2rem',
                                letterSpacing: '2px',
                                transform: 'rotate(180deg)',
                                fontFamily: '"Outfit", sans-serif'
                            }}>
                                BankKod
                            </div>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: '#050b18',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Bot size={22} color={colors.accent} />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            )}

            {/* ChatGPT 5.0 Style Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: colors.bg,
                            color: colors.text,
                            display: 'flex',
                            zIndex: 2000,
                            fontFamily: '"Inter", sans-serif'
                        }}
                    >
                        {/* Sidebar - Pro Design */}
                        <div style={{
                            width: '260px',
                            background: colors.sidebar,
                            padding: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '10px 8px' }}>
                                <motion.div whileHover={{ scale: 1.05 }} style={{ cursor: 'pointer' }}>
                                    <PanelLeftClose size={22} color={colors.textMuted} />
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} onClick={() => setMessages([])} style={{ cursor: 'pointer' }}>
                                    <SquarePen size={22} color={colors.textMuted} />
                                </motion.div>
                            </div>

                            <SidebarItem icon={Bot} label="BankKod AI" active />
                            <SidebarItem icon={LayoutGrid} label="Explore Apps" />

                            <div style={{ height: '30px' }} />

                            <p style={{ fontSize: '0.7rem', color: '#676767', padding: '0 12px 10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Yesterday</p>
                            <SidebarItem icon={MessageCircle} label="Banking Security Check" />
                            <SidebarItem icon={MessageCircle} label="Balance Inquiry Flow" />
                            <SidebarItem icon={MessageCircle} label="Account Recovery" />

                            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                                <SidebarItem icon={Zap} label="Upgrade Plan" />
                                <div style={{ height: '8px' }} />
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 12px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: colors.accent, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800' }}>DE</div>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Deepak (Go)</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Chat Area - Pro Design */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            {/* Header with Exit */}
                            <div style={{
                                padding: '16px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                zIndex: 10
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px', borderRadius: '10px' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>BankKod 5.2</span>
                                    <ChevronDown size={16} color={colors.textMuted} />
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <motion.button
                                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                                        style={{ background: 'transparent', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}
                                    >
                                        <Share size={20} color={colors.textMuted} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ backgroundColor: colors.accent, color: '#000' }}
                                        onClick={() => setIsOpen(false)}
                                        style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: colors.text, padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
                                    >
                                        Close
                                    </motion.button>
                                </div>
                            </div>

                            {/* Center Scroll Area */}
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: messages.length === 0 ? 'center' : 'flex-start',
                                overflowY: 'auto',
                                paddingTop: '80px',
                                scrollBehavior: 'smooth'
                            }} ref={scrollRef}>
                                {messages.length === 0 ? (
                                    <div style={{ textAlign: 'center' }}>
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            style={{ marginBottom: '24px' }}
                                        >
                                            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: colors.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(251,189,35,0.2)' }}>
                                                <Bot size={36} color="#1a1a1a" />
                                            </div>
                                        </motion.div>
                                        <motion.h1
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{ fontSize: '2.4rem', fontWeight: '600', marginBottom: '8px', letterSpacing: '-1px', color: '#fff' }}
                                        >
                                            What's on your mind today?
                                        </motion.h1>
                                        <p style={{ color: colors.textMuted, fontSize: '1.1rem' }}>Personalized banking AI at your service</p>
                                    </div>
                                ) : (
                                    <div style={{ width: '100%', maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: '40px', padding: '40px 20px' }}>
                                        {messages.map((msg) => (
                                            <div key={msg.id} style={{
                                                display: 'flex',
                                                gap: '24px',
                                                alignItems: 'flex-start',
                                                animation: 'fadeIn 0.4s ease-out'
                                            }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '8px',
                                                    background: msg.sender === 'user' ? colors.accent : '#1a2a4a',
                                                    color: '#050b18',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(0, 210, 255, 0.3)' : 'none'
                                                }}>
                                                    {msg.sender === 'user' ? <UserIcon size={18} /> : <Bot size={18} color={colors.accent} />}
                                                </div>
                                                <div style={{
                                                    fontSize: '1rem',
                                                    lineHeight: '1.7',
                                                    color: colors.text,
                                                    paddingTop: '3px',
                                                    maxWidth: 'calc(100% - 60px)',
                                                    whiteSpace: 'pre-wrap'
                                                }}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        ))}
                                        {loading && (
                                            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', paddingLeft: '56px' }}>
                                                <div className="typing-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.accent }} />
                                                <span style={{ fontSize: '0.9rem', color: colors.textMuted, fontWeight: '500' }}>Processing your request...</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Bottom Fixed Area */}
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '20px 20px 32px',
                                background: `linear-gradient(to top, ${colors.bg} 80%, transparent)`
                            }}>
                                <div style={{
                                    width: '100%',
                                    maxWidth: '780px',
                                    position: 'relative'
                                }}>
                                    <form onSubmit={handleSend} style={{
                                        background: colors.inputBg,
                                        borderRadius: '26px',
                                        padding: '10px 18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        transition: 'border-color 0.2s',
                                    }} onFocusCapture={(e) => e.currentTarget.style.borderColor = colors.accent}
                                        onBlurCapture={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}>

                                        <motion.button whileHover={{ scale: 1.1 }} type="button" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                            <Plus size={22} color={colors.textMuted} />
                                        </motion.button>

                                        <input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="Ask BankKod anything..."
                                            style={{
                                                flex: 1,
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#fff',
                                                fontSize: '1.05rem',
                                                padding: '12px 0',
                                                outline: 'none',
                                                fontFamily: '"Inter", sans-serif'
                                            }}
                                        />

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <motion.button whileHover={{ color: '#fff' }} type="button" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: colors.textMuted }}>
                                                <Mic size={22} />
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                type="submit"
                                                disabled={!input.trim() || loading}
                                                style={{
                                                    width: '38px',
                                                    height: '38px',
                                                    borderRadius: '12px',
                                                    background: input.trim() ? colors.accent : '#555',
                                                    border: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                                }}
                                            >
                                                <AudioLines size={20} color="#050b18" strokeWidth={2.5} />
                                            </motion.button>
                                        </div>
                                    </form>
                                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: colors.textMuted, marginTop: '16px', letterSpacing: '0.2px' }}>
                                        BankKod 5.2 Private Model • Professional Financial Assistant
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap');
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes pulseDot {
                    0% { opacity: 0.4; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.1); }
                    100% { opacity: 0.4; transform: scale(0.8); }
                }

                .typing-dot {
                    animation: pulseDot 1.5s infinite ease-in-out;
                }

                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </>
    );
};

export default ChatBot;
