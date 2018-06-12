/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   client.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: nkouris <nkouris@student.42.us.org>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/06/02 13:40:27 by nkouris           #+#    #+#             */
/*   Updated: 2018/06/05 17:18:00 by nkouris          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "server.h"
#include "client.h"
#include "communication.h"
#include "player.h"

/* method function prototypes */
static int32_t new (int32_t cl);
static int32_t isplayer(int32_t cl);
static void del(int32_t cl);

/* method object */
t_client_methods client = {
	&new,
	&isplayer,
	&del};

static int32_t new (int32_t cl)
{
	int32_t ret;

	ret = EXIT_SUCCESS;
	printf("<--- NEW CLIENT --->\n");
	if (!((SRV_TEMP.purgatory)[cl]))
	{
		printf("Send handshake request");
		ret = communicate.toclient.outgoing(cl, "WELCOME\n");
		(SRV_TEMP.purgatory)[cl] = NOT_ACCEPTED;
	}
	return (ret);
}

static int32_t isplayer(int32_t cl)
{
	int32_t ret;

	if (player.islost(cl))
	{
		printf("Player is lost\n");
		ret = player.add_toteam(cl);
	}
	else
	{
		ret = player.new(cl);
		ret = player.add_toteam(cl);
	}
	return (ret);
}

static void del(int32_t cl)
{
	close(cl);
	FD_CLR(cl, SRV_SOCK.copy);
}
