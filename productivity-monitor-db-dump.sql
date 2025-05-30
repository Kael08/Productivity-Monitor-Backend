PGDMP  8    0                }            productivity-monitor-db    16.6    16.6 7    	           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            
           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16405    productivity-monitor-db    DATABASE     �   CREATE DATABASE "productivity-monitor-db" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
 )   DROP DATABASE "productivity-monitor-db";
                postgres    false            �            1259    41000    custom_modes    TABLE     �  CREATE TABLE public.custom_modes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name character varying(256) NOT NULL,
    mode_name character varying(256) NOT NULL,
    process_list character varying(256)[] NOT NULL,
    url_list character varying(256)[] NOT NULL,
    is_domain_blocker_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
     DROP TABLE public.custom_modes;
       public         heap    postgres    false            �            1259    40999    custom_modes_id_seq    SEQUENCE     �   CREATE SEQUENCE public.custom_modes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.custom_modes_id_seq;
       public          postgres    false    228                       0    0    custom_modes_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.custom_modes_id_seq OWNED BY public.custom_modes.id;
          public          postgres    false    227            �            1259    41017    daily_statistics    TABLE     �  CREATE TABLE public.daily_statistics (
    id integer NOT NULL,
    user_id integer NOT NULL,
    date date NOT NULL,
    monitoring_time interval DEFAULT '00:00:00'::interval NOT NULL,
    blocked_processes integer DEFAULT 0 NOT NULL,
    blocked_domains integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 $   DROP TABLE public.daily_statistics;
       public         heap    postgres    false            �            1259    41016    daily_statistics_id_seq    SEQUENCE     �   CREATE SEQUENCE public.daily_statistics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.daily_statistics_id_seq;
       public          postgres    false    230                       0    0    daily_statistics_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.daily_statistics_id_seq OWNED BY public.daily_statistics.id;
          public          postgres    false    229            �            1259    32790    notes    TABLE       CREATE TABLE public.notes (
    id integer NOT NULL,
    user_id integer,
    title character varying(255),
    content text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.notes;
       public         heap    postgres    false            �            1259    32789    notes_id_seq    SEQUENCE     �   CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.notes_id_seq;
       public          postgres    false    222                       0    0    notes_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;
          public          postgres    false    221            �            1259    24623    refresh_tokens    TABLE     )  CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token_hash character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_revoked boolean DEFAULT false
);
 "   DROP TABLE public.refresh_tokens;
       public         heap    postgres    false            �            1259    24622    refresh_tokens_id_seq    SEQUENCE     �   CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.refresh_tokens_id_seq;
       public          postgres    false    220                       0    0    refresh_tokens_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;
          public          postgres    false    219            �            1259    32873 
   todo_items    TABLE     e  CREATE TABLE public.todo_items (
    id integer NOT NULL,
    todo_list_id integer NOT NULL,
    description text NOT NULL,
    is_completed boolean DEFAULT false,
    priority integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deadline date
);
    DROP TABLE public.todo_items;
       public         heap    postgres    false            �            1259    32872    todo_items_id_seq    SEQUENCE     �   CREATE SEQUENCE public.todo_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.todo_items_id_seq;
       public          postgres    false    226                       0    0    todo_items_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.todo_items_id_seq OWNED BY public.todo_items.id;
          public          postgres    false    225            �            1259    32859 
   todo_lists    TABLE       CREATE TABLE public.todo_lists (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.todo_lists;
       public         heap    postgres    false            �            1259    32858    todo_lists_id_seq    SEQUENCE     �   CREATE SEQUENCE public.todo_lists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.todo_lists_id_seq;
       public          postgres    false    224                       0    0    todo_lists_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.todo_lists_id_seq OWNED BY public.todo_lists.id;
          public          postgres    false    223            �            1259    24598    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    24609    users_credentials    TABLE     �   CREATE TABLE public.users_credentials (
    id integer NOT NULL,
    user_id integer NOT NULL,
    login character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL
);
 %   DROP TABLE public.users_credentials;
       public         heap    postgres    false            �            1259    24608    users_credentials_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_credentials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.users_credentials_id_seq;
       public          postgres    false    218                       0    0    users_credentials_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.users_credentials_id_seq OWNED BY public.users_credentials.id;
          public          postgres    false    217            �            1259    24597    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    216                       0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    215            O           2604    41003    custom_modes id    DEFAULT     r   ALTER TABLE ONLY public.custom_modes ALTER COLUMN id SET DEFAULT nextval('public.custom_modes_id_seq'::regclass);
 >   ALTER TABLE public.custom_modes ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    227    228    228            S           2604    41020    daily_statistics id    DEFAULT     z   ALTER TABLE ONLY public.daily_statistics ALTER COLUMN id SET DEFAULT nextval('public.daily_statistics_id_seq'::regclass);
 B   ALTER TABLE public.daily_statistics ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    229    230            D           2604    32793    notes id    DEFAULT     d   ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);
 7   ALTER TABLE public.notes ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    222    222            A           2604    24626    refresh_tokens id    DEFAULT     v   ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);
 @   ALTER TABLE public.refresh_tokens ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219    220            J           2604    32876    todo_items id    DEFAULT     n   ALTER TABLE ONLY public.todo_items ALTER COLUMN id SET DEFAULT nextval('public.todo_items_id_seq'::regclass);
 <   ALTER TABLE public.todo_items ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    226    225    226            G           2604    32862    todo_lists id    DEFAULT     n   ALTER TABLE ONLY public.todo_lists ALTER COLUMN id SET DEFAULT nextval('public.todo_lists_id_seq'::regclass);
 <   ALTER TABLE public.todo_lists ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    224    224            =           2604    24601    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    216    216            @           2604    24612    users_credentials id    DEFAULT     |   ALTER TABLE ONLY public.users_credentials ALTER COLUMN id SET DEFAULT nextval('public.users_credentials_id_seq'::regclass);
 C   ALTER TABLE public.users_credentials ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            l           2606    41010    custom_modes custom_modes_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.custom_modes
    ADD CONSTRAINT custom_modes_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.custom_modes DROP CONSTRAINT custom_modes_pkey;
       public            postgres    false    228            n           2606    41027 &   daily_statistics daily_statistics_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.daily_statistics
    ADD CONSTRAINT daily_statistics_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.daily_statistics DROP CONSTRAINT daily_statistics_pkey;
       public            postgres    false    230            p           2606    41029 2   daily_statistics daily_statistics_user_id_date_key 
   CONSTRAINT     v   ALTER TABLE ONLY public.daily_statistics
    ADD CONSTRAINT daily_statistics_user_id_date_key UNIQUE (user_id, date);
 \   ALTER TABLE ONLY public.daily_statistics DROP CONSTRAINT daily_statistics_user_id_date_key;
       public            postgres    false    230    230            f           2606    32799    notes notes_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.notes DROP CONSTRAINT notes_pkey;
       public            postgres    false    222            b           2606    24630 "   refresh_tokens refresh_tokens_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.refresh_tokens DROP CONSTRAINT refresh_tokens_pkey;
       public            postgres    false    220            d           2606    24632 ,   refresh_tokens refresh_tokens_token_hash_key 
   CONSTRAINT     m   ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_hash_key UNIQUE (token_hash);
 V   ALTER TABLE ONLY public.refresh_tokens DROP CONSTRAINT refresh_tokens_token_hash_key;
       public            postgres    false    220            j           2606    32884    todo_items todo_items_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.todo_items
    ADD CONSTRAINT todo_items_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.todo_items DROP CONSTRAINT todo_items_pkey;
       public            postgres    false    226            h           2606    32866    todo_lists todo_lists_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.todo_lists
    ADD CONSTRAINT todo_lists_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.todo_lists DROP CONSTRAINT todo_lists_pkey;
       public            postgres    false    224            ^           2606    24616 -   users_credentials users_credentials_login_key 
   CONSTRAINT     i   ALTER TABLE ONLY public.users_credentials
    ADD CONSTRAINT users_credentials_login_key UNIQUE (login);
 W   ALTER TABLE ONLY public.users_credentials DROP CONSTRAINT users_credentials_login_key;
       public            postgres    false    218            `           2606    24614 (   users_credentials users_credentials_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.users_credentials
    ADD CONSTRAINT users_credentials_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.users_credentials DROP CONSTRAINT users_credentials_pkey;
       public            postgres    false    218            Z           2606    24605    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            \           2606    24607    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    216            v           2606    41011 &   custom_modes custom_modes_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.custom_modes
    ADD CONSTRAINT custom_modes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 P   ALTER TABLE ONLY public.custom_modes DROP CONSTRAINT custom_modes_user_id_fkey;
       public          postgres    false    228    216    4698            w           2606    41030 .   daily_statistics daily_statistics_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.daily_statistics
    ADD CONSTRAINT daily_statistics_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 X   ALTER TABLE ONLY public.daily_statistics DROP CONSTRAINT daily_statistics_user_id_fkey;
       public          postgres    false    230    216    4698            s           2606    32800    notes notes_user_id_fkey    FK CONSTRAINT     w   ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 B   ALTER TABLE ONLY public.notes DROP CONSTRAINT notes_user_id_fkey;
       public          postgres    false    216    222    4698            r           2606    24633 *   refresh_tokens refresh_tokens_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 T   ALTER TABLE ONLY public.refresh_tokens DROP CONSTRAINT refresh_tokens_user_id_fkey;
       public          postgres    false    216    220    4698            u           2606    32885 '   todo_items todo_items_todo_list_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.todo_items
    ADD CONSTRAINT todo_items_todo_list_id_fkey FOREIGN KEY (todo_list_id) REFERENCES public.todo_lists(id);
 Q   ALTER TABLE ONLY public.todo_items DROP CONSTRAINT todo_items_todo_list_id_fkey;
       public          postgres    false    224    4712    226            t           2606    32867 "   todo_lists todo_lists_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.todo_lists
    ADD CONSTRAINT todo_lists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 L   ALTER TABLE ONLY public.todo_lists DROP CONSTRAINT todo_lists_user_id_fkey;
       public          postgres    false    216    4698    224            q           2606    24617 0   users_credentials users_credentials_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users_credentials
    ADD CONSTRAINT users_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 Z   ALTER TABLE ONLY public.users_credentials DROP CONSTRAINT users_credentials_user_id_fkey;
       public          postgres    false    4698    218    216           