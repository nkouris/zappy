/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   io.c                                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: nkouris <nkouris@student.42.us.org>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/06/04 14:14:23 by nkouris           #+#    #+#             */
/*   Updated: 2018/06/05 19:04:41 by nkouris          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "server.h"
#include "client.h"
#include "team.h"

static inline __attribute__((always_inline))void	add_fd_select(int32_t sock)
{
	printf("fd to add : <%d>\ncurrent nfds : <%d>\n", sock, SRV_SOCK.nfds);
	FD_SET(sock, SRV_SOCK.copy);
	if (SRV_SOCK.nfds <= sock)
		SRV_SOCK.nfds = (sock + 1);
}

static inline __attribute__((always_inline))int32_t	pregame_message(int32_t i)
{
	char	buf[PEEK];

	SRV_CLNT = i;
	if (FD_ISSET(i, SRV_SOCK.input))
	{
		if (recv(i, &buf, PEEK, MSG_PEEK | MSG_DONTWAIT) == 0)
		{
			close(i);
			FD_CLR(i, SRV_SOCK.copy);
			printf("Remove client <%d> from fdset\n", i);
		}
		else if ((SRV_TEMP.purgatory)[i] == NOT_ACCEPTED)
		{
			printf("client <%d> is in purgatory, and trying to join a team\n", i);
			if (client.isplayer(i) == EXIT_FAILURE)
			{
				printf("fail is player\n");
				// return (EXIT_FAILURE);
			}
		}
	}
	return (EXIT_SUCCESS);
}

static inline __attribute__((always_inline))int32_t	add_client(void)
{
	int32_t	newfd;

	newfd = accept(SRV_SOCK.sockfd,
				(struct sockaddr *)&(SRV_SOCK.temp), &(SRV_SOCK.socklen));
	SRV_CLNT = newfd;
	client.new(newfd);
	printf("New client %d connected\n", newfd);
	add_fd_select(newfd);
	return (EXIT_SUCCESS);
}

/*
int32_t	game_io(void)
{
}
*/

int32_t	pregame_io(void)
{
	int32_t	i;

	i = 0;
	while ((SRV_SOCK.nfds > 0) && i <= SRV_SOCK.nfds)
	{
		if (i == SRV_SOCK.sockfd && FD_ISSET(i, SRV_SOCK.input))
		{
			if (add_client() == EXIT_FAILURE)
				return (EXIT_FAILURE);
		}
		else
		{
			if (pregame_message(i) == EXIT_FAILURE)
				return (EXIT_FAILURE);
		}
		i++;
	}
	FD_COPY(SRV_SOCK.copy, SRV_SOCK.input);
	printf("Incoming processing done\n");
	return (EXIT_SUCCESS);
}
